import { readFileSync } from "fs-extra";

let debug = false;

let realData = "./data/day9.txt";
let testData = "./data/day9-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

let filled = true;
let blocks: {
  space: number;
  content: number | undefined;
  startIndex: number;
}[] = [];
let id = 0;

let contentSoFar = 0;
for (let i = 0; i < rawInput.length; i++) {
  const count = parseInt(rawInput[i]);
  if (filled) {
    blocks.push({ space: count, content: id, startIndex: contentSoFar });
  } else {
    blocks.push({ space: count, content: undefined, startIndex: contentSoFar });
  }
  contentSoFar += count;

  if (filled) {
    id++;
  }
  filled = !filled;
}

let memory: (number | "." | "X")[] = [];
let end = 0;
for (let block of blocks) {
  for (let i = 0; i < block.space; i++) {
    memory[i + end] = block.content ?? ".";
  }
  end += block.space;
}

const contentBlocks = blocks.filter((b) => b.content).reverse();
for (let { startIndex, space, content } of contentBlocks) {
  let emptyStart = 0;
  for (let i = 0; i < startIndex; i++) {
    if (memory[i] !== ".") {
      emptyStart = i + 1;
      continue;
    }

    // update the empty start if needed
    emptyStart = Math.min(emptyStart, i);

    // see if we can fit the block into the current space
    if (i - emptyStart + 1 >= space) {
      // put the block here
      if (debug) {
        console.log(
          "Moving block " +
            content +
            " from " +
            startIndex +
            " to " +
            emptyStart
        );
        console.log({ startIndex, space, content, emptyStart, i });
      }
      for (let j = 0; j < space; j++) {
        memory[j + emptyStart] = content;
        memory[j + startIndex] = ".";
      }

      // start on the next block
      break;
    }
  }
}

if (debug) {
  let combined = "";
  for (let m of memory) {
    combined += m;
  }
  console.log({ combined });
}

// find the checksum
let checkSum = 0;
for (let i = 0; i < memory.length; i++) {
  let m = memory[i];
  if (m === "." || m === "X") {
    continue;
  }
  checkSum += i * m;
}

console.log({ checkSum });
