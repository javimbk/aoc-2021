import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const OCTOPUS_MATRIX = [];

input.on('line', (newLineFromInput) => {
  const lineWithNumbers = newLineFromInput.split('').map((e) => Number(e));
  OCTOPUS_MATRIX.push(lineWithNumbers);
});

input.on('close', () => {
  let OCTOPUS_FLASHED_COUNT = 0;
  let STEP_WHERE_EVERY_OCTOPUS_FLASHES = null;

  for (let step = 0; step < Infinity; step++) {
    const octoPositionsToFlash = [];

    OCTOPUS_MATRIX.forEach((_, rowIdx) => {
      const row = OCTOPUS_MATRIX[rowIdx];
      row.forEach((_, colIdx) => {
        const currentOctopus = OCTOPUS_MATRIX[rowIdx][colIdx];

        // + 1
        OCTOPUS_MATRIX[rowIdx][colIdx] = currentOctopus + 1;

        if (OCTOPUS_MATRIX[rowIdx][colIdx] > 9) {
          octoPositionsToFlash.push(`${rowIdx}-${colIdx}`);
        }
      });
    });

    for (let idx = 0; idx < octoPositionsToFlash.length; idx++) {
      const [rowIdx, colIdx] = octoPositionsToFlash[idx].split('-');
      const allNeighbourPositionsForElement = getAllNeighbourPositions(Number(rowIdx), Number(colIdx));

      for (const neighbourPosition of allNeighbourPositionsForElement) {
        const [neighbourRowIdx, neighbourColIdx] = neighbourPosition.split('-').map((e) => Number(e));
        const neighbourValue = OCTOPUS_MATRIX[neighbourRowIdx][neighbourColIdx];

        // + 1
        OCTOPUS_MATRIX[neighbourRowIdx][neighbourColIdx] = neighbourValue + 1;

        if (OCTOPUS_MATRIX[neighbourRowIdx][neighbourColIdx] > 9) {
          // If it's already on the list don't bother putting it inside, they will only flash once.
          if (!octoPositionsToFlash.includes(neighbourPosition)) {
            octoPositionsToFlash.push(neighbourPosition);
          }
        }
      }
    }

    let stepFlashes = 0;

    OCTOPUS_MATRIX.forEach((_, rowIdx) => {
      const row = OCTOPUS_MATRIX[rowIdx];
      row.forEach((_, colIdx) => {
        if (OCTOPUS_MATRIX[rowIdx][colIdx] > 9) {
          OCTOPUS_MATRIX[rowIdx][colIdx] = 0;
          stepFlashes = stepFlashes + 1;
          OCTOPUS_FLASHED_COUNT = OCTOPUS_FLASHED_COUNT + 1;
        }
      });
    });

    if (stepFlashes === 100) {
      STEP_WHERE_EVERY_OCTOPUS_FLASHES = step + 1; // We start from 0.
      break;
    }
  }

  console.log('🏁 Result:', STEP_WHERE_EVERY_OCTOPUS_FLASHES);
});

// Helpers

function getAllNeighbourPositions(rowIdx, colIdx) {
  return [
    OCTOPUS_MATRIX[rowIdx - 1]?.[colIdx - 1] && `${rowIdx - 1}-${colIdx - 1}`,
    OCTOPUS_MATRIX[rowIdx - 1]?.[colIdx] && `${rowIdx - 1}-${colIdx}`,
    OCTOPUS_MATRIX[rowIdx - 1]?.[colIdx + 1] && `${rowIdx - 1}-${colIdx + 1}`,
    OCTOPUS_MATRIX[rowIdx]?.[colIdx - 1] && `${rowIdx}-${colIdx - 1}`,
    OCTOPUS_MATRIX[rowIdx]?.[colIdx + 1] && `${rowIdx}-${colIdx + 1}`,
    OCTOPUS_MATRIX[rowIdx + 1]?.[colIdx - 1] && `${rowIdx + 1}-${colIdx - 1}`,
    OCTOPUS_MATRIX[rowIdx + 1]?.[colIdx] && `${rowIdx + 1}-${colIdx}`,
    OCTOPUS_MATRIX[rowIdx + 1]?.[colIdx + 1] && `${rowIdx + 1}-${colIdx + 1}`,
  ].filter((e) => e !== undefined);
}
