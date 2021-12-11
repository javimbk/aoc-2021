import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const PARSED_HEATMAP = [];

input.on('line', (newLineFromInput) => {
  const heatmapRow = newLineFromInput;
  PARSED_HEATMAP.push(heatmapRow);
});

input.on('close', () => {
  const BASIN_SIZES = [];
  const allLowPoints = getAllLowPointsInHeatMap();

  for (const lowPoint of allLowPoints) {
    const basinElements = [];
    basinElements.push(lowPoint);

    // basinElements auto-updates with new elements, until it doesn't add a new one.
    for (let idx = 0; idx < basinElements.length; idx++) {
      const element = basinElements[idx];
      const [_, elementRowIdx, elementColIdx] = element.split('-');

      const allNeighbours = getAllNeighboursFromOneElement(Number(elementRowIdx), Number(elementColIdx));

      for (const neighbour of allNeighbours) {
        if (!basinElements.includes(neighbour)) {
          basinElements.push(neighbour);
        }
      }
    }

    BASIN_SIZES.push(basinElements.length);
  }

  // Sorting Basin sizes in descendent order.
  BASIN_SIZES.sort((a, b) => b - a);

  const firstThreeBasinSizes = BASIN_SIZES.slice(0, 3);
  const totalResult = firstThreeBasinSizes.reduce((acc, cur) => acc * cur, 1);

  console.log('🏁 Result:', totalResult);
});

// Helpers

/** value-rowIdx-colIdx */
function getAllLowPointsInHeatMap() {
  const lowPoints = [];

  for (let x = 0; x < PARSED_HEATMAP.length; x++) {
    const row = PARSED_HEATMAP[x];
    for (let y = 0; y < row.length; y++) {
      const element = row[y];

      if (isThisElementALowPoint(x, y)) {
        lowPoints.push(`${element}-${x}-${y}`);
      }
    }
  }

  return lowPoints;
}

/** TOP - LEFT - BOTTOM - RIGHT | If the neighbour exists (not out of bounds) it should be higher */
function isThisElementALowPoint(rowIdx, colIdx) {
  const currentElementValue = PARSED_HEATMAP[rowIdx][colIdx];

  return (
    (rowIdx - 1 < 0 || currentElementValue < PARSED_HEATMAP[rowIdx - 1][colIdx]) &&
    (colIdx - 1 < 0 || currentElementValue < PARSED_HEATMAP[rowIdx][colIdx - 1]) &&
    (rowIdx + 1 >= PARSED_HEATMAP.length || currentElementValue < PARSED_HEATMAP[rowIdx + 1][colIdx]) &&
    (colIdx + 1 >= PARSED_HEATMAP[rowIdx].length || currentElementValue < PARSED_HEATMAP[rowIdx][colIdx + 1])
  );
}

/** TOP - LEFT - BOTTOM - RIGHT */
function getAllNeighboursFromOneElement(rowIdx, colIdx) {
  const allNeighbours = [];

  if (rowIdx - 1 >= 0 && PARSED_HEATMAP[rowIdx - 1][colIdx] !== '9') {
    allNeighbours.push(`${PARSED_HEATMAP[rowIdx - 1][colIdx]}-${rowIdx - 1}-${colIdx}`);
  }

  if (colIdx - 1 >= 0 && PARSED_HEATMAP[rowIdx][colIdx - 1] !== '9') {
    allNeighbours.push(`${PARSED_HEATMAP[rowIdx][colIdx - 1]}-${rowIdx}-${colIdx - 1}`);
  }

  if (rowIdx + 1 < PARSED_HEATMAP.length && PARSED_HEATMAP[rowIdx + 1][colIdx] !== '9') {
    allNeighbours.push(`${PARSED_HEATMAP[rowIdx + 1][colIdx]}-${rowIdx + 1}-${colIdx}`);
  }

  if (colIdx + 1 < PARSED_HEATMAP[rowIdx].length && PARSED_HEATMAP[rowIdx][colIdx + 1] !== '9') {
    allNeighbours.push(`${PARSED_HEATMAP[rowIdx][colIdx + 1]}-${rowIdx}-${colIdx + 1}`);
  }

  return allNeighbours;
}
