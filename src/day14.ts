import { readFileSync } from "fs-extra";

let debug = false;

let realData = "./data/day14.txt";
let testData = "./data/day14-test.txt";

const boardRows = debug ? 7 : 103;
const boardCols = debug ? 11 : 101;

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

type Guard = {
  posX: number;
  posY: number;
  speedX: number;
  speedY: number;
};

function printBoard() {
  const board: number[][] = [];

  for (let row = 0; row < boardRows; row++) {
    board.push([]);
    for (let col = 0; col < boardCols; col++) {
      board[row][col] = 0;
    }
  }
  for (let guard of guards) {
    board[guard.posY][guard.posX]++;
  }

  // output the board at current time
  for (let row = 0; row < boardRows; row++) {
    const printedRow = board[row].map((r) => (r === 0 ? "." : r)).join("");
    console.log(printedRow);
    if (printedRow.indexOf("1111111111") >= 0) {
      throw "AHHH";
    }
  }
}

const re = /(-?\d+)/gm;

const guards: Guard[] = rawInput.split("\n").map((line) => {
  const values = line.match(re).map((v) => parseInt(v));

  return {
    posX: values[0],
    posY: values[1],
    speedX: values[2],
    speedY: values[3],
  };
});

// console.log({ guards });

// move to the next step
// const stepCount = 100; for (let step = 0; step < stepCount; step++) {
//   console.log({ step });
//   guards.forEach((g) => {
//     g.posX = (g.posX + g.speedX + boardCols) % boardCols;
//     g.posY = (g.posY + g.speedY + boardRows) % boardRows;
//   });
//   // printBoard();
// }

let centerCol = (boardCols - 1) / 2;
let centerRow = (boardRows - 1) / 2;

let quad00 = 0;
let quad01 = 0;
let quad10 = 0;
let quad11 = 0;

// count each quadrant
guards.forEach((g) => {
  const col = g.posX;
  const row = g.posY;
  if (row < centerRow) {
    if (col < centerCol) {
      quad00++;
    } else if (col > centerCol) {
      quad10++;
    }
  } else if (row > centerRow) {
    if (col < centerCol) {
      quad01++;
    } else if (col > centerCol) {
      quad11++;
    }
  }
});

// console.log({ quad00, quad01, quad10, quad11 });
// console.log({ total: quad00 * quad01 * quad10 * quad11 });

function countAdjacents() {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const board: number[][] = [];

  for (let row = 0; row < boardRows; row++) {
    board.push([]);
    for (let col = 0; col < boardCols; col++) {
      board[row][col] = 0;
    }
  }
  for (let guard of guards) {
    board[guard.posY][guard.posX]++;
  }

  let adjacents = 0;
  for (let guard of guards) {
    for (let direction of directions) {
      const nRow = guard.posX + direction[0];
      const nCol = guard.posY + direction[1];
      if (
        nRow < 0 ||
        nCol < 0 ||
        nRow >= board.length ||
        nCol >= board[0].length
      ) {
        continue;
      }
      adjacents += board[nRow][nCol];
    }
  }
  return adjacents;
}

async function run() {
  let count = 0;
  // let maxAdjacents = 0;
  while (true) {
    guards.forEach((g) => {
      g.posX = (g.posX + g.speedX + boardCols) % boardCols;
      g.posY = (g.posY + g.speedY + boardRows) % boardRows;
    });
    count++;

    // based on seeing this go by and narrowing the range
    console.log({ count });
    printBoard();

    // if (count % 69 === 0) {
    //   console.log("\n\n\n");
    //   console.log({ count });
    //   await new Promise((resolve) => setTimeout(resolve, 300));
    //   printBoard();
    // }

    // const newAdjacents = countAdjacents();
    // if (newAdjacents > maxAdjacents) {
    //   console.log({ newAdjacents });
    //   printBoard();
    //   maxAdjacents = newAdjacents;
    // }
  }
}

run();
