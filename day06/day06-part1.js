import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

let PARSED_INPUT = null;

const LANTERNFISH_CREATION_COOLDOWN = 2;

input.on('line', (newLineFromInput) => {
  const numbersList = newLineFromInput.split(',').map((e) => Number(e));
  PARSED_INPUT = numbersList;
});

input.on('close', () => {
  let DAYS_ELAPSED = 0;

  const allFishesList = [...PARSED_INPUT];

  while (DAYS_ELAPSED !== 80) {
    allFishesList.forEach((value, idx) => {
      const [newValue, shouldCreateNewLanternfish] = tickOneDayForLanternfish(value);
      allFishesList[idx] = newValue;
      if (shouldCreateNewLanternfish) {
        allFishesList.push(8);
      }
    });
    DAYS_ELAPSED++;
  }

  const numberOfFishes = allFishesList.length;

  console.log('🏁 Result:', numberOfFishes);
});

function tickOneDayForLanternfish(timerValue) {
  let newTimerValue = null;
  let shouldCreateNewLanternfish = false;

  if (timerValue === 0) {
    newTimerValue = 6;
    shouldCreateNewLanternfish = true;
  } else {
    newTimerValue = timerValue - 1;
  }

  return [newTimerValue, shouldCreateNewLanternfish];
}
