import { expect } from "chai";
import hre from "hardhat";

describe("Counter", function () {
  it("Should start with count = 0", async function () {
    const counter = await hre.viem.deployContract("Counter");
    expect(await counter.read.count()).to.equal(0n);
  });

  it("Should increment count", async function () {
    const counter = await hre.viem.deployContract("Counter");
    await counter.write.increment();
    expect(await counter.read.count()).to.equal(1n);
  });
});