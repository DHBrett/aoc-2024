import { readFileSync } from "fs-extra";
import { Position } from "./day6";

let debug = false;

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
  console.log("\n");
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

let grid: CellType[][] = [];
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

const cloneGrid = (grid: CellType[][]) => {
  return grid.map((row) => {
    return [...row];
  });
};

let moveNumber = 0;
for (let move of moves) {
  // attempt to move everything on a new grid
  console.log({ move: moveNumber++ });
  const newGrid = cloneGrid(grid);
  let isValid = true;
  const previousRobot = { ...robot };

  if (Math.abs(move[1]) === 1) {
    // we are moving horizontally
    let needToPlace: CellType | "Robot" = "Robot";
    let nRow = robot.row + move[0];
    let nCol = robot.col + move[1];
    while (true) {
      if (!inBounds({ row: nRow, col: nCol })) {
        isValid = false;
        break;
      }

      const nextCell = newGrid[nRow][nCol];
      if (nextCell === CellType.Wall) {
        isValid = false;
        break;
      }

      if (nextCell === CellType.Empty) {
        // we're done
        if (needToPlace === "Robot") {
          robot.col = nCol;
          robot.row = nRow;
        } else {
          newGrid[nRow][nCol] = needToPlace;
        }

        break;
      }

      // current cell is something else that needs to be moved
      let temp = needToPlace;
      needToPlace = nextCell;
      if (temp === "Robot") {
        newGrid[nRow][nCol] = CellType.Empty;
        robot.row = nRow;
        robot.col = nCol;
      } else {
        newGrid[nRow][nCol] = temp;
      }
      nRow += move[0];
      nCol += move[1];
    }
  } else {
    // we are moving vertically
    let nRow = robot.row + move[0];
    let nCol = robot.col + move[1];
    if (!inBounds({ row: nRow, col: nCol })) {
      isValid = false;
      debug && printBoard(grid);
      continue;
    }

    const nextCell = newGrid[nRow][nCol];
    if (nextCell === CellType.Wall) {
      isValid = false;
      debug && printBoard(grid);
      continue;
    }

    if (nextCell === CellType.Empty) {
      // We can just move the robot without any other fuss
      robot.row = nRow;
      robot.col = nCol;
      debug && printBoard(grid);
      continue;
    }

    // we need to move a box
    let boxesToMove: {
      leftBoxPosition: Position;
    }[] = [];

    const addBoxToList = (
      type: CellType.LeftBox | CellType.RightBox,
      position: Position
    ) => {
      const leftBoxPosition =
        type === CellType.LeftBox
          ? position
          : { ...position, col: position.col - 1 };

      if (
        // not already in the list
        !boxesToMove.find(
          (cb) =>
            cb.leftBoxPosition.col === leftBoxPosition.col &&
            cb.leftBoxPosition.row === leftBoxPosition.row
        )
      ) {
        boxesToMove.unshift({ leftBoxPosition });
      }
    };

    addBoxToList(nextCell, { row: nRow, col: nCol });
    while (boxesToMove.length) {
      let nextBox = boxesToMove.pop();
      let newBoxRow = nextBox.leftBoxPosition.row + move[0];
      let newBoxLeftCol = nextBox.leftBoxPosition.col + move[1];
      let newBoxRightCol = nextBox.leftBoxPosition.col + move[1] + 1;

      if (
        !inBounds(nextBox.leftBoxPosition) ||
        !inBounds({ row: newBoxRow, col: newBoxRightCol }) ||
        newGrid[newBoxRow][newBoxLeftCol] === CellType.Wall ||
        newGrid[newBoxRow][newBoxRightCol] === CellType.Wall
      ) {
        isValid = false;
        break;
      }

      if (
        newGrid[newBoxRow][newBoxLeftCol] === CellType.Empty &&
        newGrid[newBoxRow][newBoxRightCol] === CellType.Empty
      ) {
        // move the box here
        newGrid[nextBox.leftBoxPosition.row][nextBox.leftBoxPosition.col] =
          CellType.Empty;
        newGrid[nextBox.leftBoxPosition.row][nextBox.leftBoxPosition.col + 1] =
          CellType.Empty;
        newGrid[newBoxRow][newBoxLeftCol] = CellType.LeftBox;
        newGrid[newBoxRow][newBoxRightCol] = CellType.RightBox;
      } else {
        // another box or two, add it to the list to be handled first and then come back to this one
        if (newGrid[newBoxRow][newBoxLeftCol] !== CellType.Empty) {
          addBoxToList(newGrid[newBoxRow][newBoxLeftCol], {
            row: newBoxRow,
            col: newBoxLeftCol,
          });
        }

        if (newGrid[newBoxRow][newBoxRightCol] !== CellType.Empty) {
          addBoxToList(newGrid[newBoxRow][newBoxRightCol], {
            row: newBoxRow,
            col: newBoxRightCol,
          });
        }

        // put this box back on the list
        addBoxToList(CellType.LeftBox, nextBox.leftBoxPosition);
      }
    }

    if (isValid) {
      robot.row = robot.row + move[0];
      robot.col = robot.col + move[1];
    }
  }

  if (isValid) {
    grid = newGrid;
  } else {
    robot.row = previousRobot.row;
    robot.col = previousRobot.col;
  }
  debug && printBoard(grid);
}

let sum = 0;
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] === CellType.LeftBox) {
      sum += 100 * row + col;
    }
  }
}

printBoard(grid);
console.log({ sum });
