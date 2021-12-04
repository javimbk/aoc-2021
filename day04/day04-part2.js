import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

let NUMBER_DRAW_LIST = [];

const BOARD_COLLECTION = {};
let currentBoardIndex = 0;
let currentBoardRowIndex = 0;

input.on('line', (newLineFromInput) => {
  // Initial State, fill the Number Draw List.
  if (NUMBER_DRAW_LIST.length === 0) {
    NUMBER_DRAW_LIST = newLineFromInput.split(',').map((e) => Number(e));
    return;
  }

  // Initial State, don't do anything with the first empty line.
  if (Object.keys(BOARD_COLLECTION).length === 0 && !newLineFromInput) {
    return;
  }

  // If BOARD_COLLECTION initialized and new empty space, start new board and reset currentBoardRowIndex.
  if (Object.keys(BOARD_COLLECTION).length !== 0 && !newLineFromInput) {
    currentBoardIndex = currentBoardIndex + 1;
    currentBoardRowIndex = 0;
    return;
  }

  // If board doesn't exist and line is not empty, initialize board and keep going.
  if (!BOARD_COLLECTION[currentBoardIndex]) {
    BOARD_COLLECTION[currentBoardIndex] = {
      board: [],
      marked: [],
      winner: false,
    };
  }

  const newBoardRow = newLineFromInput.split(' ').filter((e) => e);
  BOARD_COLLECTION[currentBoardIndex]['board'][currentBoardRowIndex] = newBoardRow.map((e) => Number(e));
  BOARD_COLLECTION[currentBoardIndex]['marked'][currentBoardRowIndex] = newBoardRow.map((_) => false);
  currentBoardRowIndex = currentBoardRowIndex + 1;
});

input.on('close', () => {
  const numbersCalledWhenWinnerInOrder = [];
  const winnerBoardKeysInOrder = [];

  for (const numberDrawn of NUMBER_DRAW_LIST) {
    // 1. Update all marked boards.
    for (const boardKey of Object.keys(BOARD_COLLECTION)) {
      if (BOARD_COLLECTION[boardKey]['winner']) {
        continue;
      }

      let numberInRowIndex = null;
      let numberInColumnIndex = null;

      for (const boardRowIdx of Object.keys(BOARD_COLLECTION[boardKey]['board'])) {
        const boardRow = BOARD_COLLECTION[boardKey]['board'][boardRowIdx];
        const indexOfNumber = boardRow.indexOf(numberDrawn);
        if (indexOfNumber !== -1) {
          numberInRowIndex = Number(boardRowIdx);
          numberInColumnIndex = Number(indexOfNumber);
          break;
        }
      }

      if (numberInRowIndex !== null && numberInColumnIndex !== null) {
        BOARD_COLLECTION[boardKey]['marked'][numberInRowIndex][numberInColumnIndex] = true;
        numberInRowIndex = null;
        numberInColumnIndex = null;
      }
    }

    // 2. Check if a board has a cleared Row or Column.
    for (const boardKey of Object.keys(BOARD_COLLECTION)) {
      // 2.0 If already a winner board skip checks.
      if (BOARD_COLLECTION[boardKey]['winner']) {
        continue;
      }

      // 2.1 Check if Row.
      for (const boardMarkedRow of BOARD_COLLECTION[boardKey]['marked']) {
        const isEntireRowMarked = boardMarkedRow.every((e) => e);
        if (isEntireRowMarked) {
          BOARD_COLLECTION[boardKey]['winner'] = true;
          winnerBoardKeysInOrder.push(boardKey);
          numbersCalledWhenWinnerInOrder.push(numberDrawn);
          break;
        }
      }

      // 2.1.1. Skip to next if already winner.
      if (BOARD_COLLECTION[boardKey]['winner']) {
        continue;
      }

      // 2.2 Check if Any Column.
      const columnsStatus = BOARD_COLLECTION[boardKey]['marked'][0].map((_, boardColIdx) => {
        return BOARD_COLLECTION[boardKey]['marked'].map((_, boardRowIdx) => {
          return BOARD_COLLECTION[boardKey]['marked'][boardRowIdx][boardColIdx];
        });
      });

      const isAnyColumnMarked = columnsStatus.some((column) => column.every((e) => e));

      if (isAnyColumnMarked) {
        BOARD_COLLECTION[boardKey]['winner'] = true;
        winnerBoardKeysInOrder.push(boardKey);
        numbersCalledWhenWinnerInOrder.push(numberDrawn);
        break;
      }
    }
  }

  // 3. We have a winner board, find all the indexes of unmarked numbers.
  const lastWinnerBoardKey = winnerBoardKeysInOrder[winnerBoardKeysInOrder.length - 1];
  const lastWinnerBoard = BOARD_COLLECTION[lastWinnerBoardKey];
  const numberThatWasCalledWhenLastWinner = numbersCalledWhenWinnerInOrder[numbersCalledWhenWinnerInOrder.length - 1];
  const unmarkedNumbers = [];

  lastWinnerBoard['marked'].forEach((boardRow, boardRowIdx) => {
    boardRow.forEach((markStatus, colIdx) => {
      if (!markStatus) {
        const unmarkedNumber = lastWinnerBoard['board'][boardRowIdx][colIdx];
        unmarkedNumbers.push(unmarkedNumber);
      }
    });
  });

  const unmarkedNumbersSum = unmarkedNumbers.reduce((acc, cur) => acc + cur, 0);
  const finalScore = unmarkedNumbersSum * numberThatWasCalledWhenLastWinner;

  console.log('🏁 Result:', finalScore);
});
