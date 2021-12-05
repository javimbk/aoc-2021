import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const PARSED_TUPLES = [];
let highestX = 0;
let highestY = 0;

let BOARD = null;

input.on('line', (newLineFromInput) => {
  const parsedPositionTuple = parseNewLineAndUpdateHighestXY({
    newLineFromInput,
  });
  PARSED_TUPLES.push(parsedPositionTuple);
});

input.on('close', () => {
  BOARD = getInitialBoard(highestX, highestY);

  for (const positionTuple of PARSED_TUPLES) {
    const positionsToCover = getPointIndexesToCover(positionTuple);

    if (positionsToCover !== null) {
      for (const positionToCover of positionsToCover) {
        updatePositionInBoard({ position: positionToCover });
      }
    }
  }

  const points = BOARD.reduce((acc, currentRow) => {
    const elementsThatAre2OrMore = currentRow.filter((e) => e !== '.' && e > 1);

    return acc + elementsThatAre2OrMore.length;
  }, 0);

  console.log('🏁 Result:', points);
});

// Parsing Helpers

function parseNewLineAndUpdateHighestXY({ newLineFromInput }) {
  const [position1, position2] = newLineFromInput.split(' -> ');
  const [x1, y1] = position1.split(',');
  const [x2, y2] = position2.split(',');

  const x1Number = Number(x1);
  const y1Number = Number(y1);
  const x2Number = Number(x2);
  const y2Number = Number(y2);

  if (x1Number > highestX) {
    highestX = x1Number;
  }
  if (x2Number > highestX) {
    highestX = x2Number;
  }
  if (y1Number > highestY) {
    highestY = y1Number;
  }
  if (y2Number > highestY) {
    highestY = y2Number;
  }

  return {
    x1: x1Number,
    y1: y1Number,
    x2: x2Number,
    y2: y2Number,
  };
}

// Solving Problem Helpers

function getInitialBoard(x, y) {
  const numberOfColumns = x + 1;
  const numberOfRows = y + 1;
  const board = [];

  const oneRow = Array(numberOfColumns).fill('.');

  for (let index = 0; index < numberOfRows; index++) {
    board.push([...oneRow]);
  }

  return board;
}

function getPointIndexesToCover(parsedPositionTuple) {
  const { x1, x2, y1, y2 } = parsedPositionTuple;

  // Part 1: For now consider only horizontal and vertical.
  if (x1 === x2) {
    const yPositionsToCover = getNumbersBetweenTwoNumbers(y1, y2);

    return yPositionsToCover.map((e) => [x1, e]);
  } else if (y1 === y2) {
    const xPositionsToCover = getNumbersBetweenTwoNumbers(x1, x2);

    return xPositionsToCover.map((e) => [e, y1]);
  } else {
    return null;
  }
}

function updatePositionInBoard({ position }) {
  const [x, y] = position;
  const currentPositionStatus = BOARD[y][x];

  if (currentPositionStatus === '.') {
    BOARD[y][x] = 1;
  } else {
    BOARD[y][x] = currentPositionStatus + 1;
  }
}

function getNumbersBetweenTwoNumbers(a, b) {
  if (a === b) {
    return [a, b];
  }

  const allNumbersBetweenTheTwo = [];

  const start = a > b ? b : a;
  const end = a > b ? a : b;

  for (let num = start; num <= end; num++) {
    allNumbersBetweenTheTwo.push(num);
  }

  return allNumbersBetweenTheTwo;
}
