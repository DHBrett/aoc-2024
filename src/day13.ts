import { readFileSync } from "fs-extra";
import { solve } from "linear-solve";

let debug = false;

let realData = "./data/day13.txt";
let testData = "./data/day13-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

type Equation = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  xt: number;
  yt: number;
};

let equations: Equation[] = [];

let re = /(\d+)/gm;

let upscale = 10000000000000;
for (let eq of rawInput.split("\n\n")) {
  let [aLine, bLine, prizeLine] = eq.split("\n");
  let aMatch = aLine.match(re);
  let bMatch = bLine.match(re);
  let prizeMatch = prizeLine.match(re);
  equations.push({
    x1: parseInt(aMatch[0]),
    y1: parseInt(aMatch[1]),
    x2: parseInt(bMatch[0]),
    y2: parseInt(bMatch[1]),
    xt: parseInt(prizeMatch[0]) + upscale,
    yt: parseInt(prizeMatch[1]) + upscale,
  });
}

let epsilon = 0.0001;
let totalTokens = 0;
for (let eq of equations) {
  const solution: [number, number] = solve(
    [
      [eq.x1, eq.x2],
      [eq.y1, eq.y2],
    ],
    [eq.xt, eq.yt]
  );

  const isValid = (x: number) => {
    return x > 0 && Math.abs(Math.round(x) - x) < epsilon;
  };

  if (!isValid(solution[0]) || !isValid(solution[1])) {
    console.log("No solution");
    continue;
  }

  console.log({ solution });

  totalTokens += solution[0] * 3 + solution[1];
}

console.log({ totalTokens });
