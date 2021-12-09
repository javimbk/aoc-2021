import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const PARSED_HEATMAP = [];

input.on('line', (newLineFromInput) => {
  const heatmapRow = newLineFromInput.split('').map((e) => Number(e));
  PARSED_HEATMAP.push(heatmapRow);
});

input.on('close', () => {
  const LOW_POINT_VALUES = [];

  PARSED_HEATMAP.forEach((_, rowIdx) => {
    PARSED_HEATMAP[rowIdx].forEach((_, colIdx) => {
      const cell = PARSED_HEATMAP[rowIdx][colIdx];
      const neighbours = findNeighboursForCell(rowIdx, colIdx);
      const existingNeighbours = Object.values(neighbours).filter((e) => e !== undefined);
      const isCellLowPoint = existingNeighbours.every((neighbour) => cell < neighbour);

      if (isCellLowPoint) {
        LOW_POINT_VALUES.push(cell);
      }
    });
  });

  const sumOfAllLowPoints = LOW_POINT_VALUES.reduce((acc, cur) => acc + (1 + cur), 0);
  console.log('🏁 Result:', sumOfAllLowPoints);
});

// Helpers

function findNeighboursForCell(rowIdx, colIdx) {
  return {
    top: PARSED_HEATMAP[rowIdx - 1]?.[colIdx],
    left: PARSED_HEATMAP[rowIdx]?.[colIdx - 1],
    right: PARSED_HEATMAP[rowIdx]?.[colIdx + 1],
    bottom: PARSED_HEATMAP[rowIdx + 1]?.[colIdx],
  };
}
