import { readFileSync } from "fs-extra";
import { Position } from "./day6";

let debug = true;

let realData = "./data/day15.txt";
let testData = "./data/day15-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

const [rawBoard, rawMoves] = rawInput.split("\n\n");

enum CellType {
  Wall = 0,
  LeftBox = 1,
  RightBox = 3,
  Empty = 2, // also includes the cell with the robot
}

const printBoard = (grid: CellType[][]) => {
  grid.forEach((row, rowNum) => {
    console.log(
      row
        .map((c, colNum) => {
          if (rowNum === robot.row && colNum === robot.col) {
            return "@";
          }
          switch (c) {
            case CellType.Wall:
              return "#";
            case CellType.LeftBox:
              return "[";
            case CellType.RightBox:
              return "]";
            case CellType.Empty:
              return ".";
          }
        })
        .join("")
    );
  });
};

const grid: CellType[][] = [];
const robot: Position = { row: 0, col: 0 };

// parse the board
const boardLines = rawBoard.split("\n");
for (let row = 0; row < boardLines.length; row++) {
  grid.push(
    boardLines[row].split("").flatMap((c, col) => {
      switch (c) {
        case "#":
          return [CellType.Wall, CellType.Wall];
        case ".":
          return [CellType.Empty, CellType.Empty];
        case "O":
          return [CellType.LeftBox, CellType.RightBox];
        case "@":
          robot.row = row;
          robot.col = col * 2;
          return [CellType.Empty, CellType.Empty];
        default:
          throw "invalid board char: " + c;
      }
    })
  );
}

type Direction = [-1, 0] | [1, 0] | [0, -1] | [0, 1];

// parse the moves
const moves: Direction[] = rawMoves
  .split("")
  .filter((m) => m !== "\n")
  .map((m) => {
    switch (m) {
      case "^":
        return [-1, 0];
      case ">":
        return [0, 1];
      case "<":
        return [0, -1];
      case "v":
        return [1, 0];
      default:
        throw "invalid move";
    }
  });

debug && printBoard(grid);

const inBounds = ({ row, col }: Position) => {
  if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) {
    return false;
  }
  return true;
};

for (let move of moves) {
  const nRow = robot.row + move[0];
  const nCol = robot.col + move[1];

  if (!inBounds({ row: nRow, col: nCol })) {
    continue;
  }

  // find the next cell
  const nextCell = grid[nRow][nCol];
  if (nextCell === CellType.Empty) {
    // easy case, next cell is empty so just move the robot
    robot.row = nRow;
    robot.col = nCol;
  } else if (nextCell === CellType.Wall) {
    // can't advance at all
    continue;
  } else {
    // we have hit a box - harder case, need to find the next empty space and swap if possible
    let nNRow = nRow + move[0];
    let nNCol = nCol + move[1];
    while (true) {
      if (!inBounds({ row: nNRow, col: nNCol })) {
        // no spaces to move to, give up
        break;
      }

      const nextNextCell = grid[nNRow][nNCol];
      if (nextNextCell === CellType.Wall) {
        // no spaces to move to, give up
        break;
      // } else if (nextNextCell === CellType.Box) {
      //   // just keep going, this box will be pushed if we find a space
      //   // advance to the next one
      //   nNRow = nNRow + move[0];
      //   nNCol = nNCol + move[1];
      } else {
        // we have found an empty space
        // swap the first box we hit with this space
        robot.row = nRow;
        robot.col = nCol;
        grid[nRow][nCol] = CellType.Empty;
        // grid[nNRow][nNCol] = CellType.Box;
        break;
      }
    }
  }
}

printBoard(grid);

let sum = 0;
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    // if (grid[row][col] === CellType.Box) {
    //   sum += 100 * row + col;
    // }
  }
}

console.log({ sum });
