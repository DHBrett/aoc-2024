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

let Xs: Position[] = [];
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === "X") {
      Xs.push({ row, col });
    }
  }
}

interface Direction {
  rowOffset: number;
  colOffset: number;
}

let Ms: { pos: Position; dir: Direction }[] = [];
// find the Ms
for (let X of Xs) {
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      let mrow = X.row + rowOffset;
      let mcol = X.col + colOffset;
      if (mrow < 0 || mcol < 0 || mrow >= grid.length || mcol >= grid[0].length) {
        continue;
      }

      if (grid[mrow][mcol] === "M") {
        Ms.push({
          pos: { col: mcol, row: mrow },
          dir: { rowOffset, colOffset },
        });
      }
    }
  }
}

let nextLetter = "A";
let As: { pos: Position; dir: Direction }[] = [];
for (let M of Ms) {
  let nextRow = M.pos.row + M.dir.rowOffset;
  let nextCol = M.pos.col + M.dir.colOffset;
  if (
    nextRow < 0 ||
    nextCol < 0 ||
    nextRow >= grid.length ||
    nextCol >= grid[0].length
  ) {
    continue;
  }
  if (grid[nextRow][nextCol] === nextLetter) {
    As.push({ dir: M.dir, pos: { row: nextRow, col: nextCol } });
  }
}

nextLetter = "S";
let Ss: { pos: Position; dir: Direction }[] = [];
for (let A of As) {
  let nextRow = A.pos.row + A.dir.rowOffset;
  let nextCol = A.pos.col + A.dir.colOffset;
  if (
    nextRow < 0 ||
    nextCol < 0 ||
    nextRow >= grid.length ||
    nextCol >= grid[0].length
  ) {
    continue;
  }
  if (grid[nextRow][nextCol] === nextLetter) {
    Ss.push({ dir: A.dir, pos: { row: nextRow, col: nextCol } });
  }
}

console.log(Ss.length);
