import { readFileSync } from "fs-extra";

// parse the input
const rawInput = readFileSync("./data/day2.txt").toString();

const reports = rawInput.split("\n");

let safeReports = 0;
for (let report of reports) {
  const levels = report.split(" ").map((n) => parseInt(n));
  let safe = checkSafety(levels);

  let secondChance = false;
  if (safe) {
    safeReports++;
  } else {
    for (let i = 0; i < levels.length; i++) {
      let limited = [...levels];
      limited.splice(i, 1);
      if (checkSafety(limited)) {
        // console.log({ limited, levels });
        safe = true;
        safeReports++;
        secondChance = true;
        break;
      }
    }
  }

  if (Math.random() > 0.95) {
    console.log({ levels, safe, secondChance });
  }
}

console.log({ safeReports });

function checkSafety(levels: number[]) {
  let direction: "down" | "up" | undefined = undefined;
  let safe = true;

  let previous = levels[0];
  for (let i = 1; i < levels.length; i++) {
    let curr = levels[i];
    if (curr === previous || Math.abs(curr - previous) > 3) {
      //   console.log({ curr, previous });
      safe = false;
      break;
    }

    let newDirection: "down" | "up" = curr > previous ? "up" : "down";
    if (!direction) {
      direction = newDirection;
    }
    if (newDirection !== direction) {
      //   console.log({ newDirection, direction });
      safe = false;
      break;
    }

    previous = curr;
  }
  return safe;
}
