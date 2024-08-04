import { config } from "./config.js";

export const simulation = () => {
  const conveyorBelt = new Array(config.conveyorBeltLength).fill(" ");
  const parts = [...config.parts, " "];
  let productCount = 0;
  const unusedParts = config.parts.reduce((acc, part) => {
    acc[part] = 0;
    return acc;
  }, {});

  // Assign the workers
  const workerGroups = Array.from({ length: config.conveyorBeltLength }, () =>
    new Array(config.workersPerGroup).fill().map(() => ({
      hands: [],
      buildCounter: 0,
    }))
  );

  for (let iteration = 0; iteration < config.iterations; iteration++) {
    // Choose the next part pseudorandomly
    const nextPart = parts[Math.floor(Math.random() * parts.length)];

    // Move the conveyor belt along one place (FIFO)
    const endofLine = conveyorBelt.pop();
    if (config.parts.includes(endofLine)) {
      unusedParts[endofLine]++;
    }
    conveyorBelt.unshift(nextPart);

    // Before work
    console.log(`${iteration + 1}/${config.iterations}`);
    console.log(`| ${conveyorBelt.join(" | ")} |`);

    // Do some work
    workerGroups.forEach((workerGroup, position) => {
      let groupUsedConveyorBelt = false;

      // ASSUMPTION: The workers are very polite and always go in the same order
      workerGroup.forEach((worker) => {
        // Does the worker have everything they need to make a product?
        if (config.parts.every((value) => worker.hands.includes(value))) {
          // ASSUMPTION: The worker can only place the product on the next iteration
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
    console.log(`| ${conveyorBelt.join(" | ")} |
	`);
  }

  for (const key in unusedParts) {
    unusedParts[key] += conveyorBelt.filter((slot) => slot === key).length;
  }

  return {
    productCount,
    unusedParts,
  };
};
