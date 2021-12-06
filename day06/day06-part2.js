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

  /** Fishes grouped by the lifevalue */
  const fishCountByLifeValue = {};

  // Initialize the fish group with the input
  for (const num of PARSED_INPUT) {
    fishCountByLifeValue[num] = fishCountByLifeValue[num] ? fishCountByLifeValue[num] + 1 : 1;
  }

  while (DAYS_ELAPSED !== 256) {
    /** Changes to be applied to the group by the end of the day */
    const countDiffs = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };

    // Gather the changes that are going to happen to each group of fish
    for (let countKey = 8; countKey >= 0; countKey--) {
      const fishLife = Number(countKey);
      const numberOfFishes = fishCountByLifeValue[countKey];

      // If no fishes with that lifeValue on the current state, continue.
      if (!numberOfFishes) {
        continue;
      }

      const [newFishLife, shouldCreateNewLanternfish] = tickOneDayForLanternfish(fishLife);

      countDiffs[fishLife] = countDiffs[fishLife] - numberOfFishes;
      countDiffs[newFishLife] = countDiffs[newFishLife] + numberOfFishes;
      if (shouldCreateNewLanternfish) {
        countDiffs[8] = countDiffs[8] + numberOfFishes;
      }
    }

    // Apply said changes to the group of fish, all at once.
    for (const countDiffKey of Object.keys(countDiffs)) {
      if (fishCountByLifeValue[countDiffKey] === undefined) {
        fishCountByLifeValue[countDiffKey] = 0;
      }
      fishCountByLifeValue[countDiffKey] = fishCountByLifeValue[countDiffKey] + countDiffs[countDiffKey];
    }

    DAYS_ELAPSED++;
  }

  const numberOfFishes = Object.values(fishCountByLifeValue).reduce((a, b) => a + b, 0);
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
