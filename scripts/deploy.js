require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("MyToken");
  const token = await Token.deploy(process.env.ADMIN_ADDRESS);
  
  // wait for deployment
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ Token deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
