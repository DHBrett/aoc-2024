import { readFileSync } from "fs-extra";

// parse the input
const rawInput = readFileSync("./data/day7.txt").toString();

const lines = rawInput.split("\n");

type formula = { value: number; inputs: number[] };
let formulas: formula[] = [];

for (let line of lines) {
  const split = line.split(":");
  const value = parseInt(split[0]);
  const inputs = split[1]
    .trim()
    .split(" ")
    .map((n) => parseInt(n));
  formulas.push({ value, inputs });
}

const numberToOps = (num: number, length: number) => {
  let operations = num
    .toString(3)
    .split("")
    .map((o) => (o === "0" ? op.add : o === "1" ? op.mul : op.cat));

  while (operations.length < length - 1) {
    // pad with addition until all values can be combined
    operations.unshift(op.add);
  }

  return operations;
};

enum op {
  add = "add",
  mul = "mul",
  cat = "cat",
}

const operate = (inputs: number[], operations: op[]) => {
  let value = inputs[0];
  for (let i = 0; i < operations.length; i++) {
    let nextInput = inputs[i + 1];
    switch (operations[i]) {
      case op.add:
        value += nextInput;
        break;
      case op.mul:
        value *= nextInput;
        break;
      case op.cat:
        value = parseInt(value + "" + nextInput);
        break;
    }
  }

  return value;
};

let foundSum = 0;
for (let { inputs, value } of formulas) {
  let operatorNumber = 0;
  while (true) {
    let operations = numberToOps(operatorNumber++, inputs.length);
    if (operations.length >= inputs.length) {
        // console.log({
        //   value,
        //   operations,
        //   inputs,
        //   result: "not found",
        // });
      break;
    }

    const foundValue = operate(inputs, operations);

    if (foundValue === value) {
      foundSum += foundValue;
        // console.log({
        //   value,
        //   operations,
        //   inputs,
        //   foundValue,
        // });
      break;
    }
  }
}

console.log({ foundSum });
