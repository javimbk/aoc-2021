import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const crabCount = {};

input.on('line', (newLineFromInput) => {
  const allCrabs = newLineFromInput.split(',');

  for (const crab of allCrabs) {
    if (crabCount[crab] === undefined) {
      crabCount[crab] = 1;
    } else {
      crabCount[crab] = crabCount[crab] + 1;
    }
  }
});

input.on('close', () => {
  const crabPositionNumbers = Object.keys(crabCount).map((e) => Number(e));
  const minPosition = Math.min(...crabPositionNumbers);
  const maxPosition = Math.max(...crabPositionNumbers);

  const positionExpenses = {};

  let cheapestFuelExpense = null;
  let cheapestFuelExpensePosition = null;

  for (let positionCandidate = minPosition; positionCandidate <= maxPosition; positionCandidate++) {
    let totalFuelExpense = 0;

    for (const crabKey of Object.keys(crabCount)) {
      const currentCrabPosition = Number(crabKey);
      const numberOfCrabs = crabCount[crabKey];

      const fuelExpense = getFuelExpense(currentCrabPosition, positionCandidate);
      totalFuelExpense = totalFuelExpense + numberOfCrabs * fuelExpense;
    }

    if (cheapestFuelExpense === null || totalFuelExpense < cheapestFuelExpense) {
      cheapestFuelExpense = totalFuelExpense;
      cheapestFuelExpensePosition = positionCandidate;
    }

    if (positionExpenses[positionCandidate] === undefined) {
      positionExpenses[positionCandidate] = totalFuelExpense;
    }
  }

  console.log('🏁 Result:', cheapestFuelExpense);
  console.log('🏁 Result (position):', cheapestFuelExpensePosition);
});

function getFuelExpense(crabPosition, positionCandidate) {
  return Math.abs(positionCandidate - crabPosition);
}
