import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const PARSED_INSTRUCTIONS_LIST = [];

function parseInstructionLine(lineFromInput) {
  const [command, value] = lineFromInput.split(' ');

  return { command: String(command), value: Number(value) };
}

input.on('line', (newLineFromInput) => {
  const parsedInstruction = parseInstructionLine(newLineFromInput);
  PARSED_INSTRUCTIONS_LIST.push(parsedInstruction);
});

input.on('close', () => {
  const finalPosition = getPositionFromInstructionsList(PARSED_INSTRUCTIONS_LIST);
  console.log('This is the Final Position:', finalPosition);
  console.log('Part 1 Solution:', finalPosition.horizontalPosition * finalPosition.verticalPosition);
});

function getPositionFromInstructionsList(instructionsList) {
  let position = {
    horizontalPosition: 0,
    verticalPosition: 0,
  };

  const updatePositionWithInstruction = (currentPosition, instruction) => {
    const { command, value } = instruction;

    if (command === 'forward') {
      return {
        ...currentPosition,
        horizontalPosition: currentPosition.horizontalPosition + value,
      };
    } else {
      const signedValue = command === 'down' ? value : -value;
      return {
        ...currentPosition,
        verticalPosition: currentPosition.verticalPosition + signedValue,
      };
    }
  };

  instructionsList.forEach((instruction) => {
    position = updatePositionWithInstruction(position, instruction);
  });

  return position;
}
