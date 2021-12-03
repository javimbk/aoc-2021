import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const CATEGORIZED_DIGITS_LIST = {};

input.on('line', (newLineFromInput) => {
  for (let index = 0; index < newLineFromInput.length; index++) {
    if (!CATEGORIZED_DIGITS_LIST[index]) {
      CATEGORIZED_DIGITS_LIST[index] = [];
    }

    const digit = Number(newLineFromInput[index]);
    CATEGORIZED_DIGITS_LIST[index].push(digit);
  }
});

input.on('close', () => {
  const gammaRateDigits = [];
  const epsilonRateDigits = [];

  Object.keys(CATEGORIZED_DIGITS_LIST).forEach((digitKey) => {
    const digitSum = CATEGORIZED_DIGITS_LIST[digitKey].reduce((acc, cur) => acc + cur, 0);
    const moreOnesThanZeros = digitSum > CATEGORIZED_DIGITS_LIST[digitKey].length / 2;

    gammaRateDigits.push(Number(moreOnesThanZeros));
    epsilonRateDigits.push(Number(!moreOnesThanZeros));
  });

  const gammaRateBinaryNumber = gammaRateDigits.join('');
  const epsilonRateBinaryNumber = epsilonRateDigits.join('');

  const powerConsumption = parseInt(gammaRateBinaryNumber, 2) * parseInt(epsilonRateBinaryNumber, 2);

  console.log('🏁 Result:', powerConsumption);
});
