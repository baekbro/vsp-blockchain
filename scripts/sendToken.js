require("dotenv").config();
const { ethers } = require("hardhat");

const TOKEN_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // 배포 후 입력

async function sendToken(toAddress, amount) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const token = await ethers.getContractAt("MyToken", TOKEN_ADDRESS, wallet);

  const tx = await token.transfer(toAddress, ethers.utils.parseUnits(amount, 18));
  await tx.wait();

  console.log(`✅ ${amount} 토큰 전송 완료 → ${toAddress}`);
}

sendToken("0x사용자주소", "10"); // 예시: 사용자에게 10개 지급
