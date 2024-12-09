import { readFileSync } from "fs-extra";
import { Position } from "./day6";

// parse the input
const rawInput = readFileSync("./data/day8.txt").toString();

const lines = rawInput.split("\n");

// find all the characters and where they appear
let readings = new Map<string, Position[]>();
for (let row = 0; row < lines.length; row++) {
  const line = lines[row];
  for (let col = 0; col < line.length; col++) {
    let char = line[col];
    if (char === ".") {
      continue;
    }

    let current = readings.get(char) || [];
    readings.set(char, [...current, { row, col }]);
  }
}

let stations = new Set<string>();

for (let currentReadings of readings.values()) {
  if (currentReadings.length < 2) {
    continue;
  }

  for (let r1 of currentReadings) {
    for (let r2 of currentReadings) {
      if (r1 === r2) {
        continue;
      }

      let rowDiff = r2.row - r1.row;
      let colDiff = r2.col - r1.col;

      const isInBounds = (station: Position) => {
        return !(
          station.row < 0 ||
          station.col < 0 ||
          station.row >= lines.length ||
          station.col >= lines[0].length
        );
      };

      function addToResults(station: Position) {
        try {
          stations.add(station.row + "-" + station.col);
          let line = lines[station.row];
          line = line.slice(0, station.col) + "#" + line.slice(station.col + 1);
          lines[station.row] = line;
        } catch (e) {
          console.log(station);
          throw e;
        }
      }

      addToResults(r1);
      addToResults(r2);

      let station1 = { row: r2.row + rowDiff, col: r2.col + colDiff };
      let station2 = { row: r1.row - rowDiff, col: r1.col - colDiff };

      while (isInBounds(station1)) {
        addToResults(station1);
        station1 = { row: station1.row + rowDiff, col: station1.col + colDiff };
      }
      while (isInBounds(station2)) {
        addToResults(station2);
        station2 = { row: station2.row + rowDiff, col: station2.col + colDiff };
      }
    }
  }
}

console.log({ count: stations.size });

for (let line of lines) {
  console.log(line);
}

// r1: 3, 9
// r2: 5, 11
// s1: 8, 13
// s2: 1, 7

// r1: 3, 15
// r2: 5, 11
// s1: 8, 7
// s2: 1, 19

// r1: 5, 11
// r2: 3, 9
// rowdiff -2
// coldiff -2
// s1: ,
// s2: ,
