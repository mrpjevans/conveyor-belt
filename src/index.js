const { config } = require("./config");

const conveyorBelt = new Array(config.conveyorBeltLength).fill(" ");
const parts = [...config.parts, " "];
let productCount = 0;

const createWorker = () => ({
  hands: [],
  buildCounter: 0,
});

// Assign the workers
const workerGroups = new Array();
for (let index = 0; index < config.conveyorBeltLength; index++) {
  workerGroups.push([createWorker(), createWorker()]);
}

for (let index = 0; index < config.iterations; index++) {
  // Choose the next part pseudorandomly
  const nextPart = parts[Math.floor(Math.random() * 3)];

  // Move the conveyor belt along one place (FIFO)
  conveyorBelt.pop();
  conveyorBelt.unshift(nextPart);

  // Before work
  console.log(conveyorBelt.join(" | "));

  // Do some work
  workerGroups.forEach((workerGroup, position) => {
    let groupUsedConveyorBelt = false;

    // ASSUMPTION: The workers are very polite and always go in the same order
    workerGroup.forEach((worker) => {
      // Does the worker have everything they need to make a product?
      if (config.parts.every((value) => worker.hands.includes(value))) {
        // ASSUMPTION: The worker can only put the product back after the final build iteration
        if (worker.buildCounter === config.buildIterations) {
          worker.hands = ["P"];
        } else {
          worker.buildCounter++;
        }
      }

      // If another worker has used the conveyor belt, there's nothing more to do
      if (groupUsedConveyorBelt) {
        return;
      }

      const partAvailable = conveyorBelt[position];

      // Put down the product if we have one
      if (worker.hands.includes("P") && partAvailable === " ") {
        worker.hands = [];
        worker.buildCounter = 0;
        conveyorBelt[position] = "P";
        productCount++;
        groupUsedConveyorBelt = true;
        return;
      }

      // Can we take a product?
      if (
        worker.hands.length === config.hands ||
        !config.parts.includes(partAvailable)
      ) {
        return;
      }

      // Is it a needed part?
      if (!worker.hands.includes(partAvailable)) {
        worker.hands.push(partAvailable);
        conveyorBelt[position] = " ";
        groupUsedConveyorBelt = true;
        return;
      }
    });
  });

  // After work
  console.log(conveyorBelt.join(" | ") + "\n");
}

console.log(`Products assembled: ${productCount}`);
