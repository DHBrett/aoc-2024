import { readFileSync } from "fs-extra";

// parse the input
const rawInput = readFileSync("./data/day1.txt").toString();

const leftList: number[] = [];
const rightList: number[] = [];

for (let line of rawInput.split("\n")) {
  let split = line.split(" ").map((n) => parseInt(n));
  leftList.push(split[0]);
  rightList.push(split[1]);
}

leftList.sort();
rightList.sort();

let diffSum = 0;
for (let i = 0; i < leftList.length; i++) {
  diffSum += Math.abs(leftList[i] - rightList[i]);
}

console.log({ diffSum });

let mapRightListToCount = new Map<number, number>();
for (let right of rightList) {
  let current = mapRightListToCount[right] || 0;
  mapRightListToCount[right] = current + 1;
}

let similarity = 0;
for (let left of leftList) {
  let count = mapRightListToCount[left];
  if (count) {
    similarity += left * count;
  }
}

console.log({ similarity });
