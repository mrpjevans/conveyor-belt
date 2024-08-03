const { config } = require("./config");

const conveyorBelt = new Array(config.conveyorBeltLength).fill(" ");
const parts = ["A", "B", " "];
let productCount = 0;

const doWork = (worker, partAvailable, otherWorkerDidWork) => {
  // Do I have everything I need to make a product?
  if (["A", "B"].every((value) => worker.hands.includes(value))) {
    // ASSUMPTION: The worker can only put the product back after the final build iteration
    if (worker.buildCounter === config.buildIterations) {
      worker.hands = ["P"];
    } else {
      worker.buildCounter++;
    }
  }

  if (!otherWorkerDidWork) {
    // Put down the product if we have one
    const productIndex = worker.hands.indexOf("P");
    if (productIndex !== -1 && partAvailable === " ") {
      worker.hands.splice(productIndex, 1);
      return "P";
    }

    // Can we take a product?
    if (worker.hands.length === 2 || [" ", "P"].includes(partAvailable)) {
      return false;
    }

    if (!worker.hands.includes(partAvailable)) {
      worker.hands.push(partAvailable);
      return true;
    }
  }

  // No interaction with the conveyor belt took place
  return false;
};

// Assign the workers
const worker = { hands: new Array(), buildCounter: 0 };
const workerPairs = new Array();
for (let index = 0; index < config.conveyorBeltLength; index++) {
  workerPairs.push([worker, worker]);
}

for (let index = 0; index < config.iterations; index++) {
  // Choose the next part pseudorandomly
  const nextPart = parts[Math.floor(Math.random() * 3)];

  // Move the conveyor belt along one place (FIFO)
  conveyorBelt.pop();
  conveyorBelt.unshift(nextPart);

  // Do some work
  workerPairs.forEach((workerPair, position) => {
    let workDone = false;
    workerPair.forEach((worker) => {
      // Will return true if a part was taken, P if a product was placed and false if unable to work
      workDone = doWork(worker, conveyorBelt[position], workDone);
      if (workDone === "P") {
        conveyorBelt[position] = "P";
        productCount++;
      } else if (workDone) {
        conveyorBelt[position] = " ";
      }
    });
  });

  console.log(conveyorBelt.join(" | "));
}

console.log(`Products assembled: ${productCount}`);
