import { readFileSync } from "fs-extra";

let debug = false;

let realData = "./data/day9.txt";
let testData = "./data/day9-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

let filled = true;
let memory: (number | ".")[] = [];
let end = 0;
let id = 0;
for (let char of rawInput) {
  const count = parseInt(char);
  for (let i = 0; i < count; i++) {
    if (filled) {
      memory[i + end] = id;
    } else {
      memory[i + end] = ".";
    }
  }

  end += count;

  if (filled) {
    id++;
  }
  filled = !filled;
}

let left = 0;
let right = memory.length - 1;
while (true) {
  // iterate left up until we find an empty space
  while (memory[left] !== ".") {
    left++;
  }

  // iterate right down until we find a value
  while (memory[right] === ".") {
    right--;
  }

  // check
  if (left >= right) {
    break;
  }

  // swap the values
  memory[left] = memory[right];
  memory[right] = ".";
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
  if (m === ".") {
    break;
  }
  checkSum += i * m;
}

console.log({ checkSum });
