import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const PARSED_INPUT_LIST = [];

input.on('line', (newLineFromInput) => {
  const depth = Number(newLineFromInput);
  PARSED_INPUT_LIST.push(depth);
});

input.on('close', () => {
  const { increasesCount, decreasesCount } = depthChangesCountInSlidingWindowOf3(PARSED_INPUT_LIST);
  console.log({ increasesCount, decreasesCount });
});

function depthChangesCountInSlidingWindowOf3(parsedInputList) {
  let increasesCount = 0;
  let decreasesCount = 0;

  parsedInputList.forEach((_, currentIdx) => {
    // Do nothing if on the first value.
    if (currentIdx === 0) {
      return;
    }

    const windowOf4Values = [
      parsedInputList[currentIdx - 1],
      parsedInputList[currentIdx],
      parsedInputList[currentIdx + 1],
      parsedInputList[currentIdx + 2],
    ];

    // Do nothing if there's not enough values.
    if (windowOf4Values.some((val) => val === undefined)) {
      return;
    }

    const lastWindowSum = windowOf4Values.slice(0, 3).reduce((a, b) => a + b, 0);
    const currentWindowSum = windowOf4Values.slice(1, 4).reduce((a, b) => a + b, 0);

    const depthDifference = lastWindowSum - currentWindowSum;

    if (depthDifference > 0) {
      increasesCount = increasesCount + 1;
    } else if (depthDifference < 0) {
      decreasesCount = decreasesCount + 1;
    } else {
      return;
    }
  });

  return {
    increasesCount,
    decreasesCount,
  };
}
