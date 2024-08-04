import { simulation } from "./simulation.js";

const { productCount, unusedParts } = simulation();

console.log(`Products assembled: ${productCount}`);
for (const key in unusedParts) {
  console.log(`Part ${key} unused: ${unusedParts[key]}`);
}
