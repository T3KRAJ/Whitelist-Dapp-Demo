const {ethers} = require("hardhat");

async function main() {
  const whiteListContractFactory = await ethers.getContractFactory("whitelist");
  const whiteListContract = await whiteListContractFactory.deploy(10);
  await whiteListContract.deployed();
  console.log("Contract deployed to:", whiteListContract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
