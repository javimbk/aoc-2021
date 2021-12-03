import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const ALL_STRING_NUMBERS_LIST = [];

input.on('line', (newLineFromInput) => {
  ALL_STRING_NUMBERS_LIST.push(newLineFromInput);
});

input.on('close', () => {
  const oxygenGeneratorRating = filterValuesBasedOnBitCriteria(ALL_STRING_NUMBERS_LIST, 'oxygen-generator');
  const co2ScrubberRating = filterValuesBasedOnBitCriteria(ALL_STRING_NUMBERS_LIST, 'co2-scrubber');
  const lifeSupportRating = parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2);

  console.log('🏁 Result:', lifeSupportRating);
});

function filterValuesBasedOnBitCriteria(fullNumbersList, ratingValueType) {
  const digitIsOneIndexes = [];
  const digitIsZeroIndexes = [];

  let nextCandidateIndexes = [...fullNumbersList.map((_, idx) => idx)];
  let currentStringIndex = 0;

  const getNextCandidateIndexesBasedOnRatingValueType = (digitIsOneIndexes, digitIsZeroIndexes, ratingValueType) => {
    const moreOnesThanZeroes = digitIsOneIndexes.length >= digitIsZeroIndexes.length;

    if (ratingValueType === 'oxygen-generator') {
      return moreOnesThanZeroes ? digitIsOneIndexes : digitIsZeroIndexes;
    } else if (ratingValueType === 'co2-scrubber') {
      return moreOnesThanZeroes ? digitIsZeroIndexes : digitIsOneIndexes;
    }
  };

  while (nextCandidateIndexes.length > 1) {
    nextCandidateIndexes.forEach((idx) => {
      if (fullNumbersList[idx][currentStringIndex] === '1') {
        digitIsOneIndexes.push(idx);
      } else {
        digitIsZeroIndexes.push(idx);
      }
    });

    nextCandidateIndexes = [
      ...getNextCandidateIndexesBasedOnRatingValueType(digitIsOneIndexes, digitIsZeroIndexes, ratingValueType),
    ];

    digitIsOneIndexes.length = 0;
    digitIsZeroIndexes.length = 0;
    currentStringIndex = currentStringIndex + 1;
  }

  const ratingValueIndex = nextCandidateIndexes.pop();

  return fullNumbersList[ratingValueIndex];
}
