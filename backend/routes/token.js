const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
require("dotenv").config();
const { authenticateToken, authenticateAdmin } = require("../middleware/auth");
const User = require("../models/User");

// ABI 및 Provider 설정
const tokenJson = require("../abi/MyToken.json");
const tokenAbi = tokenJson.abi;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const tokenAddress = process.env.TOKEN_ADDRESS;
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

// ✅ 사용자: 자기 지갑으로 토큰 전송 (보안 로직 추가됨)
router.post("/send", authenticateToken, async (req, res) => {
  const { userAddress, amount } = req.body;
  const sender = await User.findOne({ where: { email: req.user.email } });

  if (!sender || !sender.privateKey) {
    return res.status(403).json({ error: "지갑이 없습니다." });
  }

  // 🔐 자기 자신에게 전송 시도 차단
  if (userAddress.toLowerCase() === sender.wallet_address.toLowerCase()) {
    return res.status(400).json({ error: "자기 자신에게 전송할 수 없습니다." });
  }

  try {
    const wallet = new ethers.Wallet(sender.privateKey, provider);
    const contractWithSigner = tokenContract.connect(wallet);

    const tx = await contractWithSigner.transfer(userAddress, ethers.parseEther(amount.toString()));
    await tx.wait();

    return res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    return res.status(500).json({ error: "토큰 전송 실패", reason: err.message });
  }
});

// ✅ 사용자: 잔액 조회
router.get("/balance", async (req, res) => {
  const { address } = req.query;
  try {
    const balance = await tokenContract.balanceOf(address);
    res.json({ balance: ethers.formatEther(balance) });
  } catch (err) {
    res.status(500).json({ error: "잔액 조회 실패", reason: err.message });
  }
});

// ✅ 관리자: 토큰 발행 (Mint)
router.post("/admin/mint", authenticateAdmin, async (req, res) => {
  const { toAddress, amount } = req.body;

  try {
    const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithAdmin = tokenContract.connect(adminWallet);

    const tx = await contractWithAdmin.mint(toAddress, ethers.parseEther(amount.toString()));
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: "토큰 발행 실패", reason: err.message });
  }
});

// ✅ 관리자: 사용자 목록 조회
router.get("/admin/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "wallet_address"]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "사용자 목록 조회 실패", reason: err.message });
  }
});

// ✅ 관리자: 특정 사용자 지갑에 토큰 전송
router.post("/admin/transfer", authenticateAdmin, async (req, res) => {
  const { toAddress, amount } = req.body;

  try {
    const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractWithAdmin = tokenContract.connect(adminWallet);

    const tx = await contractWithAdmin.transfer(toAddress, ethers.parseEther(amount.toString()));
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: "토큰 전송 실패", reason: err.message });
  }
});

module.exports = router;
