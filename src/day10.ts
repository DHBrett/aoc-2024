import { readFileSync } from "fs-extra";

let debug = false;

let realData = "./data/day10.txt";
let testData = "./data/day10-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

class Node {
  children: Node[] = [];
  #cachedPaths: undefined | number;

  constructor(
    public elevation: number,
    public row: number,
    public col: number
  ) {}

  descendantPaths() {
    if (this.#cachedPaths) {
      return this.#cachedPaths;
    }

    const value = this.#findPaths();
    this.#cachedPaths = value;
    return value;
  }

  #findPaths() {
    if (this.elevation === 9) {
      debug &&
        console.log(`Found ${this.elevation} at ${this.row}, ${this.col}`);
      // const key = this.row + "-" + this.col;
      // const simpleSet = new Set<string>();
      // simpleSet.add(key);
      return 1;
    }

    // let paths = new Set<string>();
    let paths = 0;
    for (let child of this.children) {
      const descendants = child.descendantPaths();
      debug && console.log({ descendants });
      paths += descendants;
    }

    debug &&
      console.log(
        `Checking paths for ${this.elevation} at ${this.row}, ${this.col}`
      );
    debug && console.log(`Found ${paths} downstream from here`);
    return paths;
  }
}

const createGrid = () => {
  const startingGrid: Node[][] = [];

  const rows = rawInput.split("\n");
  for (let row = 0; row < rows.length; row++) {
    let newRow = rows[row].split("");
    startingGrid.push(
      newRow.map((n, col) => {
        return new Node(parseInt(n), row, col);
      })
    );
  }

  return startingGrid;
};

let grid = createGrid();

let starts: Node[] = [];

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    let current = grid[row][col];

    // keep track of all potential starting points
    if (current.elevation === 0) {
      starts.push(current);
    }

    // update with the relevant children
    current.children =
      // the directions we can go
      [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]
        .map((d) => {
          // find the relevant positions
          return { row: row + d[0], col: col + d[1] };
        })
        .filter(
          // find ones in bounds
          (n) =>
            n.row >= 0 &&
            n.col >= 0 &&
            n.row < grid.length &&
            n.col < grid[0].length
        )
        // find the nodes themselves
        .map((pos) => grid[pos.row][pos.col])
        // only nodes with the right value
        .filter((n) => n.elevation === current.elevation + 1);
  }
}

let count = 0;

starts.forEach((s) => {
  let newCount = s.descendantPaths();
  debug && console.log({ row: s.row, col: s.col, newCount });
  count += newCount;
});

console.log({ count });
