import { readFileSync } from "fs-extra";

// parse the input
const rawInput = readFileSync("./data/day5.txt").toString();

const rules: { before: number; after: number }[] = [];
const tests: number[][] = [];

for (let line of rawInput.split("\n")) {
  if (line.includes("|")) {
    const split = line.split("|").map((n) => parseInt(n));
    rules.push({ before: split[0], after: split[1] });
  } else if (line.includes(",")) {
    const split = line.split(",").map((n) => parseInt(n));
    tests.push(split);
  }
}

// input parsed, process it

// for each of the "after"s, create a list of the "before"s
// that way, if we encounter a before after an after, we know it's invalid

let afterToBeforeMap = new Map<number, number[]>();
for (let rule of rules) {
  const current = afterToBeforeMap.get(rule.after) || [];
  afterToBeforeMap.set(rule.after, [...current, rule.before]);
}

let passingSum = 0;
let failingTests: number[][] = [];
for (let test of tests) {
  let goodPrint = checkIfTestIsValid(test);

  // add to the sum
  if (goodPrint) {
    const middle = test[Math.floor(test.length / 2)];
    passingSum += middle;
    // console.log({ middle, sum: passingSum });
  } else {
    // console.log("failed: " + JSON.stringify(test));
    failingTests.push(test);
  }
}

console.log({ passingSum });

let failingSum = 0;
for (let test of failingTests) {
  // console.log("\n\n" + test);
  // map from the before to the index of the after (which came before)
  let invalids = new Map<number, number>();
  for (let i = 0; i < test.length; i++) {
    let page = test[i];
    if (invalids.has(page)) {
      // swap the offending pages and try again
      const invalid = invalids.get(page);
      // console.log("swapping index " + i + " and index " + invalid);
      test[i] = test[invalid];
      test[invalid] = page;
      // console.log(test);
      invalids = new Map<number, number>();
      i = -1;
      continue;
    }

    const newInvalids = afterToBeforeMap.get(page) || [];
    for (let newInvalid of newInvalids) {
      // intentionally overwrite what was there before so when we do swap it will be the shortest distance between them
      invalids.set(newInvalid, i);
    }
  }

  if (!checkIfTestIsValid(test)) {
    console.log(test);
  }

  const middle = test[Math.floor(test.length / 2)];
  failingSum += middle;
}

console.log({ failingSum });

function checkIfTestIsValid(test: number[]) {
  let goodPrint = true;
  const invalids = new Map<number, number[]>();
  for (let page of test) {
    if (invalids.has(page)) {
      console.log(page + " came after " + invalids.get(page));
      goodPrint = false;
      break;
    }

    const newInvalids = afterToBeforeMap.get(page) || [];
    for (let newInvalid of newInvalids) {
      const currentBefores = invalids.get(newInvalid) || [];
      invalids.set(newInvalid, [...currentBefores, page]);
    }
  }
  return goodPrint;
}
