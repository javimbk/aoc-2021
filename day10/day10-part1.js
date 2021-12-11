import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const ALL_INPUTS = [];

input.on('line', (newLineFromInput) => {
  ALL_INPUTS.push(newLineFromInput);
});

const SCORE_PER_CHARACTER = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

input.on('close', () => {
  const syntaxErrorCharacters = [];

  for (let lineIdx = 0; lineIdx < ALL_INPUTS.length; lineIdx++) {
    const line = ALL_INPUTS[lineIdx];
    const openCharactersChecked = [];

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const element = line[charIdx];
      const lastCheckedOpenElement = openCharactersChecked[openCharactersChecked.length - 1];

      if (isAnOpenCharacter(element)) {
        openCharactersChecked.push(element);
      } else if (isACloseCharacter(element)) {
        if (!isAPair(lastCheckedOpenElement, element)) {
          syntaxErrorCharacters.push(element);
          break;
        } else if (isAPair(lastCheckedOpenElement, element)) {
          openCharactersChecked.pop();
        }
      }
    }
  }

  const totalScore = syntaxErrorCharacters.reduce((acc, cur) => acc + SCORE_PER_CHARACTER[cur], 0);
  console.log('🏁 Result:', totalScore);
});

// Helpers

function isAnOpenCharacter(character) {
  const openCharacters = ['(', '[', '{', '<'];

  return openCharacters.includes(character);
}

function isACloseCharacter(character) {
  const closeCharacters = [')', ']', '}', '>'];

  return closeCharacters.includes(character);
}

function isAPair(character1, character2) {
  const pairOfCharacters = ['()', '[]', '{}', '<>'];

  return pairOfCharacters.includes(`${character1}${character2}`);
}
