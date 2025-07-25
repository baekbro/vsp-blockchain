const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("배포 계정 주소:", deployer.address);

  const Token = await ethers.getContractFactory("MyToken");

  // 🟢 초기 발행량 설정: 1000 MTK → 18자리 소수로 변환
  const initialSupply = ethers.parseUnits("1000", 18);

  // 🟢 constructor 인자로 공급량 전달
  const token = await Token.deploy(initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ 토큰 컨트랙트 배포 완료:", address);

  // .env 파일에 저장
  const envPath = path.resolve(__dirname, "../.env");
  fs.appendFileSync(envPath, `\nTOKEN_ADDRESS=${address}`);
  console.log("📦 .env 파일에 TOKEN_ADDRESS 저장 완료");
}

main().catch((error) => {
  console.error("🚨 배포 실패:", error);
  process.exitCode = 1;
});
