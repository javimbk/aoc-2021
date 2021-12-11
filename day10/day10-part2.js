import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const ALL_INPUTS = [];
const GOOD_INCOMPLETE_INPUTS = [];

input.on('line', (newLineFromInput) => {
  ALL_INPUTS.push(newLineFromInput);
});

const SCORE_PER_CHARACTER = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

input.on('close', () => {
  const syntaxErrorCharacters = [];

  for (let lineIdx = 0; lineIdx < ALL_INPUTS.length; lineIdx++) {
    const line = ALL_INPUTS[lineIdx];
    const openCharactersChecked = [];
    let isErrorLine = false;

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const element = line[charIdx];
      const lastCheckedOpenElement = openCharactersChecked[openCharactersChecked.length - 1];

      if (isAnOpenCharacter(element)) {
        openCharactersChecked.push(element);
      } else if (isACloseCharacter(element)) {
        if (!isAPair(lastCheckedOpenElement, element)) {
          syntaxErrorCharacters.push(element);
          isErrorLine = true;
          break;
        } else if (isAPair(lastCheckedOpenElement, element)) {
          openCharactersChecked.pop();
        }
      }
    }

    // Line is good but incomplete.
    if (!isErrorLine) {
      GOOD_INCOMPLETE_INPUTS.push(line);
    }
  }

  const allLineScores = [];

  for (let lineIdx = 0; lineIdx < GOOD_INCOMPLETE_INPUTS.length; lineIdx++) {
    const line = GOOD_INCOMPLETE_INPUTS[lineIdx];
    const openCharactersChecked = [];
    let isErrorLine = false;

    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const element = line[charIdx];
      const lastCheckedOpenElement = openCharactersChecked[openCharactersChecked.length - 1];

      if (isAnOpenCharacter(element)) {
        openCharactersChecked.push(element);
      } else if (isACloseCharacter(element)) {
        if (isAPair(lastCheckedOpenElement, element)) {
          openCharactersChecked.pop();
        } else {
          throw new Error('should never happen');
        }
      }
    }

    openCharactersChecked.reverse();

    const lineScore = openCharactersChecked.reduce(
      (acc, cur) => acc * 5 + SCORE_PER_CHARACTER[getClosingMemberOfCharacter(cur)],
      0
    );

    allLineScores.push(lineScore);
  }

  allLineScores.sort((a, b) => b - a);

  const middleIndex = (allLineScores.length - 1) / 2;

  console.log('🏁 Result:', allLineScores[middleIndex]);
});

// Helpers

function getClosingMemberOfCharacter(character) {
  const map = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  };

  return map[character];
}

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
