import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const ALL_OUTPUT_DIGITS = [];

input.on('line', (newLineFromInput) => {
  const [_, outputDigits] = parseNewLine(newLineFromInput);

  ALL_OUTPUT_DIGITS.push(outputDigits);
});

input.on('close', () => {
  let total1478Appearances = 0;

  for (const outputDigits of ALL_OUTPUT_DIGITS) {
    for (const digit of outputDigits) {
      // 1, 4, 7, 8 are unique when it comes to number of segments
      if ([2, 4, 3, 7].includes(digit.length)) {
        total1478Appearances = total1478Appearances + 1;
      }
    }
  }

  console.log({ total1478Appearances });
});

// Parsing Helpers

function parseNewLine(newLineFromInput) {
  const [rawSignalWires, rawOutputDigits] = newLineFromInput.split(' | ');
  const outputDigits = rawOutputDigits.split(' ');

  return [rawSignalWires, outputDigits];
}
