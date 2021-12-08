import { createInputFileReadLineInterface } from '../utils.js';

const input = createInputFileReadLineInterface('./input.txt');

const ALL_INPUTS = [];

input.on('line', (newLineFromInput) => {
  const [signalWires, outputDigits] = parseNewLine(newLineFromInput);

  ALL_INPUTS.push({
    signalWires,
    outputDigits,
  });
});

input.on('close', () => {
  let totalCounter = 0;

  ALL_INPUTS.forEach((inputEntry) => {
    const { signalWires, outputDigits } = inputEntry;

    const segmentsMapping = getSegmentsMapping(signalWires);

    const mappedOutputDigits = outputDigits.map((outputDigitInLetters) => {
      const outputDigitInSegments = outputDigitInLetters
        .split('')
        .map((letter) => segmentsMapping[letter])
        .sort()
        .join('');

      const singleDigit = getDigitFromSegments(outputDigitInSegments);
      return singleDigit;
    });

    const fourDigitNumber = Number(mappedOutputDigits.join(''));
    totalCounter = totalCounter + fourDigitNumber;
  });

  console.log('🏁 Result:', totalCounter);
});

// Parsing Helpers

function parseNewLine(newLineFromInput) {
  // Reordering each signalWire or outputDigit since order is not relevant and its easier to follow.
  const [rawSignalWires, rawOutputDigits] = newLineFromInput.split(' | ');

  const signalWires = rawSignalWires.split(' ').map((e) => [...e].sort().join(''));
  const outputDigits = rawOutputDigits.split(' ').map((e) => [...e].sort().join('')); // Single Digit strings can be sorted using .sort()

  return [signalWires, outputDigits];
}

// Helpers

function getSegmentsMapping(signalWires) {
  const allSegmentCandidates = {
    0: new Set(),
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
    5: new Set(),
    6: new Set(),
  };
  const foundCandidates = new Set();

  /**
   * Unique Signal Wire Length | DIGIT 1
   * Segments involved: Segment2, Segment5
   * ======================================
   * We cannot know which letter is which segment, so both letters are candidates for both segments.
   */

  const segmentsUsedForDigitOne = signalWires.find((e) => e.length === 2).split('');
  const candidatesForDigitOne = segmentsUsedForDigitOne.filter((e) => !foundCandidates.has(e));

  candidatesForDigitOne.forEach((candidate) => {
    allSegmentCandidates[2].add(candidate);
    allSegmentCandidates[5].add(candidate);
  });

  if (candidatesForDigitOne.length === 1) {
    foundCandidates.add(candidatesForDigitOne[0]);
  }

  /**
   * Unique Signal Wire Length | DIGIT 7
   * Segments involved: Segment2, Segment5, Segment0
   * ======================================
   * If we filter out the segments 2 and 5 (screened before) we are left with the only
   * possibility for Segment 0, we found a final candidate.
   */

  const segmentsUsedForDigitSeven = signalWires.find((e) => e.length === 3).split('');
  const candidatesForDigitSeven = segmentsUsedForDigitSeven
    .filter((e) => !foundCandidates.has(e))
    .filter((e) => !allSegmentCandidates[2].has(e) && !allSegmentCandidates[5].has(e));

  candidatesForDigitSeven.forEach((candidate) => {
    allSegmentCandidates[0].add(candidate);
  });

  if (candidatesForDigitSeven.length === 1) {
    foundCandidates.add(candidatesForDigitSeven[0]);
  }

  /**
   * Unique Signal Wire Length | DIGIT 4
   * Segments involved: Segment2, Segment5, Segment1 and Segment3.
   * ======================================
   * If we filter out the segments 2 and 5 (screened before) we are left with two letters for two
   * segments, so both letters are candidates for both segments.
   */

  const fourLongSignalWire = signalWires.find((e) => e.length === 4);
  const segmentsUsedForDigitFour = fourLongSignalWire.split('');
  const candidatesForDigitFour = segmentsUsedForDigitFour
    .filter((e) => !foundCandidates.has(e))
    .filter((e) => !allSegmentCandidates[2].has(e) && !allSegmentCandidates[5].has(e)); // Segment 2 and 5 were already screened.

  candidatesForDigitFour.forEach((candidate) => {
    allSegmentCandidates[1].add(candidate);
    allSegmentCandidates[3].add(candidate);
  });

  if (candidatesForDigitFour.length === 1) {
    foundCandidates.add(candidatesForDigitFour[0]);
  }

  /**
   * By this point the only unique signal wire length is for Digit 8, but it won't give us any new information.
   * We will now focus on DIGIT 3 and DIGIT 5.
   *
   * DIGIT 3
   * Segments involved: Segment0, Segment2, Segment3, Segment4, Segment6
   *
   * DIGIT 5
   * Segments involved: Segment0, Segment1, Segment3, Segment5, Segment6
   *
   * Both digits have 5 signal wire length and have had all segments screened but Segment 6, so let's focus on that.
   */

  const allCandidatesSet = getAllCandidatesSet(allSegmentCandidates);

  const segmentsUsedForDigitThreeOrFive = [];
  let candidateForSegmentSix = null;

  for (const signalWire of signalWires) {
    if (signalWire.length !== 5) {
      continue;
    }

    const setFromSignalWire = new Set(signalWire);
    const differenceInSets = new Set([...setFromSignalWire].filter((x) => !allCandidatesSet.has(x)));

    // There is only one possible segment not screened yet (Segment6), skip otherwise.
    if (differenceInSets.size !== 1) {
      continue;
    }

    // The missing letter in both cases is the only candidate possible for Segment6.
    candidateForSegmentSix = [...differenceInSets][0];
    segmentsUsedForDigitThreeOrFive.push(signalWire);
  }

  allSegmentCandidates[6].add(candidateForSegmentSix);
  foundCandidates.add(candidateForSegmentSix);

  /**
   * DIGIT 5
   * Segments involved: Segment0, Segment1, Segment3, Segment5, Segment6
   * ======================================
   * Digit 3 should contain the segments from Digit 1 (Segments 2 and 5).
   * If we filter out the signalWire that contains all the candidates from Digit 1 we will find which signalWire is Digit 5.
   */

  const segmentsUsedForDigitFive = segmentsUsedForDigitThreeOrFive.find((segmentsCandidate) => {
    const hasAllSegmentCandidatesFromDigit1 = Array.from(allSegmentCandidates[2]).every((e) =>
      segmentsCandidate.includes(e)
    );

    return !hasAllSegmentCandidatesFromDigit1;
  });

  /**
   * Segments 2 and 5 (Digit 1) have two candidates each.
   * By using the segments from Digit 5, we know that Segment2 is not supposed to be there.
   * Using the intersection between the Segments from Digit 5 and the candidates for Segment5 (same as Segment2)
   * we can know for sure Segment5.
   */

  const setFromSegmentsUsedForDigitFive = new Set(segmentsUsedForDigitFive);
  const intersectionDigitFiveAndSegmentFive = new Set(
    [...setFromSegmentsUsedForDigitFive].filter((x) => allSegmentCandidates[5].has(x))
  );
  const candidateForSegmentFive = [...intersectionDigitFiveAndSegmentFive][0];

  allSegmentCandidates[5] = new Set([...candidateForSegmentFive]);
  foundCandidates.add(candidateForSegmentFive);

  /**
   * Therefore, and since Segment2 candidates and Segment5 candidates were the same, we can know Segment2 for sure.
   */

  allSegmentCandidates[2].delete(candidateForSegmentFive);
  foundCandidates.add(...allSegmentCandidates[2]);

  /**
   * DIGIT 3
   * Segments involved: Segment0, Segment2, Segment3, Segment4, Segment6
   * ======================================
   * Now we have all segments except for Segment3, so we can know for sure.
   */

  const segmentsUsedForDigitThree = segmentsUsedForDigitThreeOrFive.filter((e) => e !== segmentsUsedForDigitFive)[0];

  const setFromSegmentsUsedForDigitThree = new Set(segmentsUsedForDigitThree);
  const intersectionDigitThreeAndSegmentThree = new Set(
    [...setFromSegmentsUsedForDigitThree].filter((x) => allSegmentCandidates[3].has(x))
  );
  const candidateForSegmentThree = [...intersectionDigitThreeAndSegmentThree][0];

  allSegmentCandidates[3] = new Set([...candidateForSegmentThree]);
  foundCandidates.add(candidateForSegmentThree);

  /**
   * Therefore, and since Segment1 candidates and Segment3 candidates were the same, we can know Segment1 for sure.
   */

  allSegmentCandidates[1].delete(candidateForSegmentThree);
  foundCandidates.add(...allSegmentCandidates[1]);

  /**
   *
   * Unique Signal Wire Length | DIGIT 8
   * Segments involved: All Segments
   * ======================================
   * To finish, only missing Segment is Segment4, and we can infer it from Digit 8, because we have the rest.
   */

  const missingSegment = signalWires
    .find((e) => e.length === 7)
    .split('')
    .filter((letter) => !foundCandidates.has(letter));

  allSegmentCandidates[4] = new Set([...missingSegment]);
  foundCandidates.add(missingSegment);

  /**
   * Dictionary to be used to transform letters into digits.
   */
  const finalSegmentMapping = {};

  for (const segmentCandidateKey of Object.keys(allSegmentCandidates)) {
    const currentSegmentCandidate = allSegmentCandidates[segmentCandidateKey];
    const finalCandidate = [...currentSegmentCandidate][0];
    finalSegmentMapping[finalCandidate] = segmentCandidateKey;
  }

  return finalSegmentMapping;
}

function getDigitFromSegments(segmentString) {
  /**
   *  0000
   * 1    2
   * 1    2
   *  3333
   * 4    5
   * 4    5
   *  6666
   */

  switch (segmentString) {
    case '012456':
      return 0;
    case '25':
      return 1;
    case '02346':
      return 2;
    case '02356':
      return 3;
    case '1235':
      return 4;
    case '01356':
      return 5;
    case '013456':
      return 6;
    case '025':
      return 7;
    case '0123456':
      return 8;
    case '012356':
      return 9;
    default:
      throw new Error(`wtf? ${segmentString}`);
  }
}

function getAllCandidatesSet(allSegmentCandidates) {
  const allCandidates = new Set();

  Object.values(allSegmentCandidates).forEach((set) => {
    if (set.size !== 0) {
      for (const value of set.values()) {
        allCandidates.add(value);
      }
    }
  });

  return allCandidates;
}
