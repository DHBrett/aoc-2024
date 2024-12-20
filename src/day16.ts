import { MinHeap } from "@datastructures-js/heap";
import { readFileSync } from "fs-extra";
import { Position } from "./day6";

let debug = false;

let realData = "./data/day16.txt";
let testData = "./data/day16-test.txt";

type CardinalDirection = "N" | "S" | "E" | "W";
const cardinalDirections: CardinalDirection[] = ["N", "S", "E", "W"];
const oppositeDirection = (d: CardinalDirection) => {
  switch (d) {
    case "N":
      return "S";
    case "S":
      return "N";
    case "E":
      return "W";
    case "W":
      return "E";
  }
};

class Edge {
  node1: Node;
  node2: Node;
  cost: number;
}

class Node {
  constructor(public position: Position, public direction: CardinalDirection) {}
  edges: Edge[] = [];
  isStart: boolean;
  isEnd: boolean;

  minReachCost: number = Infinity;

  inNodes: Node[] = [];
}

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

enum CellType {
  Wall = 0,
  Empty = 1,
  Start = 2,
  End = 3,
}
let grid: { type: CellType; nodes?: Node[] }[][] = [];

const nodes: Node[] = [];

// parse the board
const boardLines = rawInput.split("\n");
for (let row = 0; row < boardLines.length; row++) {
  grid.push(
    boardLines[row].split("").map((c, col) => {
      if (c === "#") {
        return { type: CellType.Wall };
      }

      let nodesForPoint: Node[];
      nodesForPoint = cardinalDirections.map((d) => {
        const node = new Node({ row, col }, d);
        if (c === "S" && d === "E") {
          // east is the only valid start node
          node.isStart = true;
        } else if (c === "E" && d === "N") {
          // arbitrarily choose one end node direction to be the "real" one, the others will all have 0-cost edges to it
          node.isEnd = true;
        }
        nodes.push(node);
        return node;
      });

      nodesForPoint.forEach((n) => {
        nodesForPoint.forEach((n2) => {
          if (n === n2) {
            return;
          }

          if (n.isEnd || n2.isEnd) {
            n.edges.push({
              node1: n,
              node2: n,
              cost: 0,
            });
            return;
          }

          if (n.direction === oppositeDirection(n2.direction)) {
            return;
          }

          n.edges.push({
            node1: n,
            node2: n2,
            cost: 1000,
          });
        });
      });

      switch (c) {
        case "#":
        case ".":
          return { type: CellType.Empty, nodes: nodesForPoint };
        case "S":
          return { type: CellType.Start, nodes: nodesForPoint };
        case "E":
          return { type: CellType.End, nodes: nodesForPoint };
        default:
          throw "invalid board char: " + c;
      }
    })
  );
}

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
const offsetDirectionFromCardinal = (c: CardinalDirection) => {
  switch (c) {
    case "E":
      return [0, 1];
    case "W":
      return [0, -1];
    case "N":
      return [-1, 0];
    case "S":
      return [1, 0];
  }
};

// parse the board into nodes and edges
for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    const currentNodes = grid[row][col].nodes;
    if (!currentNodes) {
      continue;
    }

    for (let node of currentNodes) {
      const offset = offsetDirectionFromCardinal(node.direction);

      const nRow = row + offset[0];
      const nCol = col + offset[1];
      if (
        nRow < 0 ||
        nCol < 0 ||
        nRow >= grid.length ||
        nCol >= grid[0].length
      ) {
        continue;
      }
      const neighbor = grid[nRow][nCol];
      if (neighbor.type === CellType.Wall) {
        continue;
      }

      // we found somewhere new we can go
      const matchingDestination = neighbor.nodes.find(
        (n) => n.direction === node.direction
      );
      if (!matchingDestination) {
        continue;
      }

      if (
        matchingDestination.edges.find(
          (e) => e.node1 === node || e.node2 === node
        )
      ) {
        // already known
        continue;
      }

      const newEdge = new Edge();
      newEdge.node1 = node;
      newEdge.node2 = matchingDestination;
      newEdge.cost = 1;
      node.edges.push(newEdge);
    }
  }
}

const start = nodes.find((n) => n.isStart);
if (!start) {
  throw "no start found";
}

class State {
  constructor(public destinationNode: Node, public fromNode: Node) {}
}

const serialize = (node: Node) => {
  return `${node.position.row}-${node.position.col}-${node.direction}`;
};

const visited = new Set<string>();
visited.add(serialize(start));

type FrontierType = { state: State; cost: number };
const frontier = new MinHeap<FrontierType>((f) => f.cost);

const addNeighbors = (node: Node, currentCost: number) => {
  node.edges.forEach((e) => {
    frontier.insert({
      cost: currentCost + e.cost,
      state: { destinationNode: e.node2, fromNode: e.node1 },
    });
  });
};

addNeighbors(start, 0);

while (true) {
  // take the cheapest new step
  const cheapest = frontier.extractRoot();
  if (!cheapest) {
    break;
  }

  const { state, cost } = cheapest;

  if (state.destinationNode.minReachCost >= cost) {
    if (state.destinationNode.minReachCost < Infinity) {
      console.log();
    }
    state.destinationNode.minReachCost = cost;
  }

  if (cost === state.destinationNode.minReachCost) {
    // should always be equal to if djikstra knows what he's talking about
    state.destinationNode.inNodes.push(state.fromNode);
  }

  const serialized = serialize(state.destinationNode);
  if (visited.has(serialized)) {
    // already got here another way
    continue;
  }

  if (!state.destinationNode.isEnd) {
    // no need to keep exploring if we found the end
    addNeighbors(state.destinationNode, cost);
  }

  visited.add(serialized);
}

const end = nodes.find((n) => n.isEnd);

// search back along all paths that ended in the end node
const allPathNodes = new Set<Node>();
const allPathLocations = new Set<string>();
const pathNodes: Node[] = [end];
while (pathNodes.length) {
  const next = pathNodes.pop();
  console.log(next.position);
  allPathLocations.add(`${next.position.row}-${next.position.col}`);
  if (allPathNodes.has(next)) {
    continue;
  }
  allPathNodes.add(next);
  pathNodes.push(...next.inNodes);
  if (next.inNodes.length === 0) {
    console.log("none");
  }
  console.log(next.inNodes.length);
}

console.log(allPathLocations.size);

const printBoard = (grid: { type: CellType }[][]) => {
  console.log("\n");
  grid.forEach((row, rowNum) => {
    console.log(
      row
        .map((c, colNum) => {
          for (let pathNode of allPathNodes) {
            if (
              pathNode.position.row === rowNum &&
              pathNode.position.col === colNum
            ) {
              return "O";
            }
          }
          switch (c.type) {
            case CellType.Wall:
              return "#";
            case CellType.End:
              return "E";
            case CellType.Start:
              return "S";
            case CellType.Empty:
              return ".";
          }
        })
        .join("")
    );
  });
};

printBoard(grid);

/**
########
#.....E#
###.#.##
#...#.##
#.#.#.##
#.....##
#S######
########


#..E
S..#

  0    1    2     3
0 X  1001  1002  
1 0    1    2     X

 */
