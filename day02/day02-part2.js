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
  const finalStatus = getPositionFromInstructionsList(PARSED_INSTRUCTIONS_LIST);
  console.log('This is the Final Position:', finalStatus);
  console.log('Part 1 Solution:', finalStatus.horizontalPosition * finalStatus.verticalPosition);
});

function getPositionFromInstructionsList(instructionsList) {
  let status = {
    horizontalPosition: 0,
    verticalPosition: 0,
    aim: 0,
  };

  const updateStatusWithInstruction = (currentStatus, instruction) => {
    const { command, value } = instruction;

    switch (command) {
      case 'forward':
        return {
          ...currentStatus,
          horizontalPosition: currentStatus.horizontalPosition + value,
          verticalPosition: currentStatus.verticalPosition + currentStatus.aim * value,
        };
      case 'down':
        return {
          ...currentStatus,
          aim: currentStatus.aim + value,
        };
      case 'up':
        return {
          ...currentStatus,
          aim: currentStatus.aim - value,
        };
      default:
        return {
          ...currentStatus,
        };
    }
  };

  instructionsList.forEach((instruction) => {
    status = updateStatusWithInstruction(status, instruction);
  });

  return status;
}
