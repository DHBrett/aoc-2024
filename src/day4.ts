import { readFileSync } from "fs-extra";
import { Position } from "./day6";

// parse the input
const rawInput = readFileSync("./data/day4.txt").toString();

const createGrid = () => {
  const startingGrid: string[][] = [];

  for (let row of rawInput.split("\n")) {
    let newRow = row.split("");
    startingGrid.push(newRow);
  }

  return startingGrid;
};

let grid = createGrid();

let firstTarget = "M";
let secondTarget = "A";
let thirdTarget = "S";

let firstLetters: Position[] = [];
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === firstTarget) {
      firstLetters.push({ row, col });
    }
  }
}

interface Direction {
  rowOffset: number;
  colOffset: number;
}

let secondLetters: { pos: Position; dir: Direction; firstLetter: Position }[] =
  [];
for (let first of firstLetters) {
  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 2) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 2) {
      let mrow = first.row + rowOffset;
      let mcol = first.col + colOffset;
      if (
        mrow < 0 ||
        mcol < 0 ||
        mrow >= grid.length ||
        mcol >= grid[0].length
      ) {
        continue;
      }

      if (grid[mrow][mcol] === secondTarget) {
        secondLetters.push({
          pos: { col: mcol, row: mrow },
          dir: { rowOffset, colOffset },
          firstLetter: first,
        });
      }
    }
  }
}

let startLetters: Position[] = [];
type middleLetter = { pos: Position; start: Position; end: Position };
let middleLetters: middleLetter[] = [];
let thirdLetters: { pos: Position; dir: Direction }[] = [];
for (let second of secondLetters) {
  let nextRow = second.pos.row + second.dir.rowOffset;
  let nextCol = second.pos.col + second.dir.colOffset;
  if (
    nextRow < 0 ||
    nextCol < 0 ||
    nextRow >= grid.length ||
    nextCol >= grid[0].length
  ) {
    continue;
  }
  if (grid[nextRow][nextCol] === thirdTarget) {
    startLetters.push(second.firstLetter);
    middleLetters.push({
      pos: second.pos,
      start: second.firstLetter,
      end: { row: nextRow, col: nextCol },
    });
    thirdLetters.push({ dir: second.dir, pos: { row: nextRow, col: nextCol } });
  }
}

const newGrid: string[][] = [];
for (let row = 0; row < grid.length; row++) {
  newGrid.push([]);
  for (let col = 0; col < grid[0].length; col++) {
    newGrid[row][col] = ".";
  }
}

// for (let start of startLetters) {
//   newGrid[start.row][start.col] = firstTarget;
// }
// for (let middle of middleLetters) {
//   newGrid[middle.pos.row][middle.pos.col] = secondTarget;
// }
// for (let third of thirdLetters) {
//   newGrid[third.pos.row][third.pos.col] = thirdTarget;
// }

let middleLetterSet = new Map<string, middleLetter>();
let repeatMiddleLetters: middleLetter[] = [];
for (let middleLetter of middleLetters) {
  let key = middleLetter.pos.row + "-" + middleLetter.pos.col;
  let existing = middleLetterSet.get(key);
  if (existing) {
    repeatMiddleLetters.push(middleLetter);
    repeatMiddleLetters.push(existing);
  }
  middleLetterSet.set(key, middleLetter);
}

for (let repeated of repeatMiddleLetters) {
  newGrid[repeated.pos.row][repeated.pos.col] = "A";
  newGrid[repeated.start.row][repeated.start.col] = "M";
  newGrid[repeated.end.row][repeated.end.col] = "S";
}

for (let row of newGrid) {
  console.log(row.join(""));
}

let repeats = middleLetters.length - middleLetterSet.size;
console.log({
  MASs: middleLetters.length,
  uniq: middleLetterSet.size,
  repeats,
});
