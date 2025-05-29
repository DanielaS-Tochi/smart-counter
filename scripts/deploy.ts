import { viem } from "hardhat";

async function main() {
  const counter = await viem.deployContract("Counter");
  console.log("Counter deployed to:", counter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});