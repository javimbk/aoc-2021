import { createInputFileReadLineInterface } from "../utils.js";

const input = createInputFileReadLineInterface("./input.txt");

let increasesCount = 0;
let decreasesCount = 0;

let lastDepth = null;

input.on("line", (newLineFromInput) => {
  const newDepth = Number(newLineFromInput);

  if (lastDepth) {
    const hasDepthIncreased = lastDepth < newDepth;

    if (hasDepthIncreased) {
      increasesCount = increasesCount + 1;
    } else {
      decreasesCount = decreasesCount + 1;
    }
  }

  lastDepth = newDepth;
});

input.on("close", () => {
  console.log({ increasesCount, decreasesCount });
});
