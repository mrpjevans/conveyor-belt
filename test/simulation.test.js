import { vi, it, describe, expect } from "vitest";
import { simulation } from "../src/simulation";

const script = "01212".repeat(20).split("");

vi.spyOn(Math, "floor").mockImplementation(() => parseInt(script.pop()));

describe("Conveyor belt simulation test", () => {
  it("should return the correct amounts", () => {
    const { productCount, unusedParts } = simulation();

    expect(productCount).toBe(9);
    expect(unusedParts).toStrictEqual({
      A: 0,
      B: 25,
    });
  });
});
