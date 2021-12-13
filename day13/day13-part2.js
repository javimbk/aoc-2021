import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

let highestX = 0;
let highestY = 0;

const DOT_POSITIONS = [];
const FOLD_INSTRUCTIONS = [];

const MATRIX = [];

input.on('line', (newLineFromInput) => {
  if (newLineFromInput === '') {
    return;
  }

  if (newLineFromInput.split(',').length === 2) {
    const [x, y] = newLineFromInput.split(',').map((e) => Number(e));

    DOT_POSITIONS.push([x, y]);
  } else {
    const foldString = newLineFromInput.split(' ')[2];
    const [foldAxis, foldIndex] = foldString.split('=');

    FOLD_INSTRUCTIONS.push([foldAxis, Number(foldIndex)]);
  }
});

input.on('close', () => {
  // Paper can be bigger than where the highest dot is.
  const firstXFoldingInstruction = FOLD_INSTRUCTIONS.find((e) => e[0] === 'x');
  const firstYFoldingInstruction = FOLD_INSTRUCTIONS.find((e) => e[0] === 'y');

  highestX = firstXFoldingInstruction[1] * 2;
  highestY = firstYFoldingInstruction[1] * 2;

  // Empty Matrix
  for (let rowIndex = 0; rowIndex <= highestY; rowIndex++) {
    MATRIX[rowIndex] = [];

    for (let colIdx = 0; colIdx <= highestX; colIdx++) {
      MATRIX[rowIndex][colIdx] = '.';
    }
  }

  // Paint Dots from List
  for (const dotPosition of DOT_POSITIONS) {
    const [x, y] = dotPosition;
    MATRIX[y][x] = '#';
  }

  // Fold Instructions
  for (const foldInstruction of FOLD_INSTRUCTIONS) {
    const [foldAxis, foldIndex] = foldInstruction;

    if (foldAxis === 'y') {
      for (let colIdx = 0; colIdx <= highestX; colIdx++) {
        MATRIX[foldIndex][colIdx] = '-';
      }

      // Go through the "folding" side.
      for (let rowIndex = foldIndex + 1; rowIndex <= highestY; rowIndex++) {
        for (let colIdx = 0; colIdx <= highestX; colIdx++) {
          if (MATRIX[rowIndex][colIdx] === '#') {
            const [newX, newY] = getMirrorPosition({ foldAxis, x: colIdx, y: rowIndex });
            MATRIX[newY][newX] = '#';
          }
        }
      }

      // Update limit indexes for matrix
      highestX = highestX;
      highestY = foldIndex - 1;
    } else if (foldAxis === 'x') {
      for (let rowIndex = 0; rowIndex <= highestY; rowIndex++) {
        MATRIX[rowIndex][foldIndex] = '-';
      }

      for (let rowIndex = 0; rowIndex <= highestY; rowIndex++) {
        for (let colIdx = foldIndex + 1; colIdx <= highestX; colIdx++) {
          if (MATRIX[rowIndex][colIdx] === '#') {
            const [newX, newY] = getMirrorPosition({ foldAxis, x: colIdx, y: rowIndex });
            MATRIX[newY][newX] = '#';
          }
        }
      }

      // Update limit indexes for matrix
      highestX = foldIndex - 1;
      highestY = highestY;
    } else {
      throw new Error('should never happen');
    }
  }

  const newMatrix = [];

  for (let rowIndex = 0; rowIndex <= highestY; rowIndex++) {
    newMatrix[rowIndex] = [];

    for (let colIdx = 0; colIdx <= highestX; colIdx++) {
      newMatrix[rowIndex][colIdx] = MATRIX[rowIndex][colIdx];
    }
  }

  const readable = newMatrix.map((e) => e.join(''));

  console.log('🏁 Result:', readable);
});

// Helpers

function getMirrorPosition({ foldAxis, x, y }) {
  let newX = null;
  let newY = null;

  if (foldAxis === 'y') {
    newX = x;
    newY = highestY - y;
  } else if (foldAxis === 'x') {
    newX = highestX - x;
    newY = y;
  } else {
    throw new Error('should never happen');
  }

  return [newX, newY];
}
