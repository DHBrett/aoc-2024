import { renameSync, WriteStream } from "fs";
import {
  createFileSync,
  createReadStream,
  createWriteStream,
  readFileSync,
  writeFileSync,
} from "fs-extra";

let debug = false;

let realData = "./data/day11.txt";
let testData = "./data/day11-test.txt";

// parse the input
const rawInput = readFileSync(debug ? testData : realData).toString();

let stones: number[] = rawInput.split(" ").map((n) => parseInt(n));

// const currentStonesPath = "./storage/day11.txt";
const firstPath = "./storage/day11-0.txt";
// const nextStonesPath = "./storage/day11-new.txt";
createFileSync(firstPath);
writeFileSync(firstPath, stones.join(","));

const iterations = debug ? 6 : 75;

const process = async (iteration: number) => {
  await new Promise((resolve) => {
    let buffer: string = "";
    const previousPath = "./storage/day11-" + iteration + ".txt";
    const nextPath = "./storage/day11-" + (iteration + 1) + ".txt";
    const reader = createReadStream(previousPath, { encoding: "utf8" });
    createFileSync(nextPath);
    const writer = createWriteStream(nextPath);

    reader.on("data", (chunk) => {
      buffer += chunk;

      const rawStones = buffer.split(",");

      // save the last one in the buffer in case it got split and include it in the next batch
      buffer = rawStones[rawStones.length - 1];
      rawStones.pop();

      const stones = rawStones.map((s) => parseInt(s));

      for (let stone of stones) {
        const processed = processStone(stone);
        writer.write(processed);
      }
    });

    reader.on("end", () => {
      let final = processStone(parseInt(buffer));

      // remove trailing ,
      final = final.substring(0, final.length - 1);

      writer.write(final);
      resolve(null);
    });
  });
};

function processStone(stone: number) {
  if (stone === 0) {
    return "1,";
  } else if (stone.toString().length % 2 === 0) {
    // even length
    const asString = stone.toString();
    const first = parseInt(asString.substring(0, asString.length / 2));
    const second = parseInt(asString.substring(asString.length / 2));
    return `${first},${second},`;
  } else {
    return stone * 2024 + ",";
  }
}

(async () => {
  try {
    console.log("starting");
    for (let i = 0; i < iterations; i++) {
      console.log({ i });
      await process(i);
      // renameSync(nextStonesPath, currentStonesPath);
    }
    console.log("done");
  } catch (err) {
    console.error("Error:", err);
  }
})();
