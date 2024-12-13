import { readFileSync } from "fs-extra";

let debug = false;

let realData = "./data/day12.txt";
let testData = "./data/day12-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

interface Plant {
  plantId: string;
  row: number;
  col: number;
  visited: boolean;
  outerEdges?: number;
  sameNeighbors: Plant[];
  topFence: boolean;
  bottomFence: boolean;
  leftFence: boolean;
  rightFence: boolean;
}

const isBorder = (p: Plant) =>
  p.bottomFence || p.topFence || p.leftFence || p.rightFence;

type Direction = "top" | "bottom" | "left" | "right";

interface Fence {
  direction: Direction;
  plants: Plant[];
}

const createGrid = () => {
  const grid: Plant[][] = [];

  let rowNumber = 0;
  for (let row of rawInput.split("\n")) {
    let col = 0;
    let newRow = row.split("");
    grid.push(
      newRow.map((p) => {
        return {
          plantId: p,
          row: rowNumber,
          col: col++,
          visited: false,
          sameNeighbors: [],
          topFence: false,
          bottomFence: false,
          leftFence: false,
          rightFence: false,
        };
      })
    );
    rowNumber++;
  }

  return grid;
};

let grid = createGrid();
let regions: Plant[][] = [];
// console.log({ grid: JSON.stringify(grid) });

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

for (let row = 0; row < grid.length; row++) {
  // console.log({ row });
  // console.log(grid[row].length);
  for (let col = 0; col < grid[row].length; col++) {
    // search starting from this node if it's not already visited
    const plant = grid[row][col];
    if (plant.visited) {
      continue;
    }
    plant.visited = true;
    const frontier = [plant];
    const plantId = plant.plantId;
    const newRegion: Plant[] = [];

    while (frontier.length) {
      const next = frontier.pop();

      newRegion.push(next);
      next.outerEdges = 0;
      directions.forEach((d) => {
        const nRow = next.row + d[0];
        const nCol = next.col + d[1];
        if (nRow < 0) {
          next.topFence = true;
          next.outerEdges++;
          return;
        } else if (nCol < 0) {
          next.leftFence = true;
          next.outerEdges++;
          return;
        } else if (nRow >= grid.length) {
          next.bottomFence = true;
          next.outerEdges++;
          return;
        } else if (nCol >= grid[0].length) {
          next.rightFence = true;
          next.outerEdges++;
          return;
        }

        const plant = grid[nRow][nCol];
        if (plant.plantId !== plantId) {
          next.outerEdges++;
          if (nRow > next.row) {
            next.bottomFence = true;
          } else if (nRow < next.row) {
            next.topFence = true;
          } else if (nCol > next.col) {
            next.rightFence = true;
          } else if (nCol < next.col) {
            next.leftFence = true;
          }
          return;
        } else {
          next.sameNeighbors.push(plant);
        }

        if (plant.visited) {
          return;
        }

        // found a new one for our region
        frontier.push(plant);
        plant.visited = true;
      });
    }

    regions.push(newRegion);
  }
}

let total = 0;
regions.forEach((r) => {
  debug && console.log(r[0].plantId);
  debug && console.log({ size: r.length });

  const borders = r.filter((p) => isBorder(p));

  const fences: Fence[] = [];
  borders.forEach((b) => {
    const directions: Direction[] = ["top", "bottom", "left", "right"];
    directions.forEach((direction) => {
      if (b[direction + "Fence"]) {
        let newFence: Fence = { direction, plants: [] };

        let frontier = [b];

        while (frontier.length) {
          const next = frontier.pop();
          next[direction + "Fence"] = false;
          newFence.plants.push(next);

          next.sameNeighbors.forEach((n) => {
            if (n[direction + "Fence"]) {
              frontier.push(n);
            }
          });
        }

        fences.push(newFence);
      }
    });
  });
  total += fences.length * r.length;
});

console.log({ total });
