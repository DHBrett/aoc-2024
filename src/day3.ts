import { readFileSync } from "fs-extra";

// parse the input
const rawInput = readFileSync("./data/day3.txt").toString();

let re = /do(n't)?\(\)|mul\((\d{1,3}),(\d{1,3})\)/gm;
const matches = rawInput.matchAll(re);
let mulsum = 0;
let adding = true;

for (let match of matches) {
  if (match[0] === "do()") {
    adding = true;
  } else if (match[0] === "don't()") {
    adding = false;
  } else if (adding) {
    let num1 = parseInt(match[2]);
    let num2 = parseInt(match[3]);
    // console.log({match, num1, num2})
    mulsum += num1 * num2;
  }
}

console.log({ mulsum });
