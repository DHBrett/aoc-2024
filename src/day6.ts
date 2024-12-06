import { readFileSync } from "fs-extra";

export interface Position {
  row: number;
  col: number;
}

// parse the input
const rawInput = readFileSync("./data/day6.txt").toString();

const createGrid = () => {
  const startingGrid: string[][] = [];

  for (let row of rawInput.split("\n")) {
    let newRow = row.split("");
    startingGrid.push(newRow);
  }

  return startingGrid;
};

let startingGrid = createGrid();
let startPosition: Position | undefined;

for (let row = 0; row < startingGrid.length; row++) {
  for (let col = 0; col < startingGrid[row].length; col++) {
    if (startingGrid[row][col] === "^") {
      startPosition = { row, col };
      break;
    }
  }

  if (startPosition) {
    break;
  }
}

type dir = "up" | "right" | "down" | "left";
let startDirection: dir = "up" as dir;
let turn: (direction: dir) => dir = (direction: dir) => {
  switch (direction) {
    case "up":
      return "right";
    case "right":
      return "down";
    case "down":
      return "left";
    case "left":
      return "up";
  }
};

let loopable = 0;
for (let row = 0; row < startingGrid.length; row++) {
  for (let col = 0; col < startingGrid[0].length; col++) {
    const newGrid = createGrid();
    newGrid[row][col] = "#";
    if (visitGrid(newGrid)) {
      loopable++;
    //   console.log({ row, col });
    }
  }
}
console.log({ loopable });

// console.log({ visited });

// let combined = "";
// for (let row of grid) {
//   combined += "\n" + row.join("");
// }

// console.log(combined);
function visitGrid(grid: string[][]) {
  let currentPosition = startPosition;
  let currentDirection = startDirection;
  let turnsSinceLastNewSquare = 0;
  while (true) {
    turnsSinceLastNewSquare++;
    if (turnsSinceLastNewSquare > 10000) {
      return true;
    }

    // find the next position
    let nextPosition: Position = undefined;
    switch (currentDirection) {
      case "up": {
        nextPosition = {
          col: currentPosition.col,
          row: currentPosition.row - 1,
        };
        break;
      }
      case "right": {
        nextPosition = {
          col: currentPosition.col + 1,
          row: currentPosition.row,
        };
        break;
      }
      case "down": {
        nextPosition = {
          col: currentPosition.col,
          row: currentPosition.row + 1,
        };
        break;
      }
      case "left": {
        nextPosition = {
          col: currentPosition.col - 1,
          row: currentPosition.row,
        };
        break;
      }
    }
    // console.log({ currentPosition, nextPosition, currentDirection });

    if (
      nextPosition.col < 0 ||
      nextPosition.row < 0 ||
      nextPosition.row >= grid.length ||
      nextPosition.col >= grid[0].length
    ) {
      // the guard has left, not a loop
      return false;
    } else if (grid[nextPosition.row][nextPosition.col] === "#") {
      // we need to turn
      currentDirection = turn(currentDirection);
    } else {
      // mark this position as visited
      if (grid[currentPosition.row][currentPosition.col] !== "X") {
        // visited++;
        turnsSinceLastNewSquare = 0;
        grid[currentPosition.row][currentPosition.col] = "X";
      }

      // move to the next one
      currentPosition = nextPosition;
    }
  }
}
