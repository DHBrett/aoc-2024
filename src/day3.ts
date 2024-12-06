import { readFileSync } from "fs-extra";

// parse the input
const rawInput = readFileSync("./data/day3.txt").toString();

let re = /mul\((\d{1,3}),(\d{1,3})\)/gm;
const matches = rawInput.matchAll(re);
let mulsum = 0;
for (let match of matches) {
  let num1 = parseInt(match[1]);
  let num2 = parseInt(match[2]);
  mulsum += num1 * num2;
}

console.log({ mulsum });
