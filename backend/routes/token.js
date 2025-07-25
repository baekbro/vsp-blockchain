const express = require("express");
const router = express.Router();
const pool = require("../db");
require("dotenv").config();
const { ethers } = require("ethers");

const TOKEN_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

router.post("/send", async (req, res) => {
  const { userAddress, amount } = req.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const token = await ethers.getContractAt("MyToken", TOKEN_ADDRESS, wallet);

    const tx = await token.transfer(userAddress, ethers.utils.parseUnits(amount.toString(), 18));
    await tx.wait();

    await pool.query(
      "UPDATE users SET token_balance = token_balance + ? WHERE wallet_address = ?",
      [amount, userAddress]
    );

    res.json({ message: "토큰 전송 완료", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "토큰 전송 실패" });
  }
});

router.get('/balance', async (req, res) => {
    const address = req.query.address;
  
    try {
      const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const token = await ethers.getContractAt("MyToken", process.env.TOKEN_ADDRESS, wallet);
  
      const balance = await token.balanceOf(address);
      res.json({ balance: balance.toString() });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '잔액 조회 실패', reason: err.message });
    }
  });
  
module.exports = router;
