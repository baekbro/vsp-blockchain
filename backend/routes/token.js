const express = require("express");
const router = express.Router();
const pool = require("../db");
require("dotenv").config({ path: __dirname + '/../.env' });
const { ethers } = require("ethers");

// 배포된 토큰의 주소와 ABI
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const tokenABI = require("../../artifacts/contracts/MyToken.sol/MyToken.json").abi;


router.post("/send", async (req, res) => {
  const { userAddress, amount } = req.body;

  try {
    // 프로바이더와 지갑 객체 생성
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // 컨트랙트 인스턴스 생성
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, wallet);

    // 토큰 전송
    const tx = await token.transfer(userAddress, ethers.parseUnits(amount.toString(), 18));
    await tx.wait();

    // DB 업데이트
    await pool.query(
      "UPDATE users SET token_balance = token_balance + ? WHERE wallet_address = ?",
      [amount, userAddress]
    );

    res.json({ message: "토큰 전송 완료", txHash: tx.hash });
  } catch (err) {
    console.error("🔴 토큰 전송 실패:", err);
    res.status(500).json({ error: "토큰 전송 실패", reason: err.message });
  }
});

router.get("/balance", async (req, res) => {
  const address = req.query.address;

  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, wallet);

    const balance = await token.balanceOf(address);
    res.json({ balance: ethers.formatUnits(balance, 18) });
  } catch (err) {
    console.error("🔴 잔액 조회 실패:", err);
    res.status(500).json({ error: "잔액 조회 실패", reason: err.message });
  }
});

module.exports = router;
