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
  Box = 1,
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
            case CellType.Box:
              return "O";
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
    boardLines[row].split("").map((c, col) => {
      switch (c) {
        case "#":
          return CellType.Wall;
        case ".":
          return CellType.Empty;
        case "O":
          return CellType.Box;
        case "@":
          robot.row = row;
          robot.col = col;
          return CellType.Empty;
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

console.log({ moves });
console.log(printBoard(grid));
