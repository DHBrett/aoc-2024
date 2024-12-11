import { readFileSync } from "fs-extra";

let debug = false;

let realData = "./data/day11.txt";
let testData = "./data/day11-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

let stones: number[] = rawInput.split(" ").map((n) => parseInt(n));

const iterations = debug ? 6 : 75;

function processStone(stone: number): number[] {
  if (stone === 0) {
    return [1];
  } else if (stone.toString().length % 2 === 0) {
    // even length
    const asString = stone.toString();
    const first = parseInt(asString.substring(0, asString.length / 2));
    const second = parseInt(asString.substring(asString.length / 2));
    return [first, second];
  } else {
    return [stone * 2024];
  }
}

let countByStone = new Map<number, number>();
stones.forEach((s) => {
  countByStone.set(s, 1);
});

for (let i = 0; i < iterations; i++) {
  debug && console.log({ i });

  let newCount = new Map<number, number>();
  for (let existing of countByStone.keys()) {
    const count = countByStone.get(existing);
    const processed = processStone(existing);
    debug && console.log({ processed });

    for (let result of processed) {
      const current = newCount.get(result) || 0;
      debug && console.log({ result, current, count });
      newCount.set(result, current + count);
    }
  }

  countByStone = newCount;
}

let sum = 0;
for (let key of countByStone.keys()) {
  sum += countByStone.get(key);
}
console.log({ sum });
