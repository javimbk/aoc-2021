import path from 'path';
import fs from 'fs';
import readline from 'readline';

export function createInputFileReadLineInterface(filepath) {
  const inputFilepath = path.resolve(filepath);
  const inputReadStream = fs.createReadStream(inputFilepath);
  const readInterface = readline.createInterface({
    input: inputReadStream,
  });
  return readInterface;
}
