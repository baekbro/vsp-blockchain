//로그인/회원가입 API 담당

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { ethers } = require("ethers");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "이미 존재하는 이메일입니다." });

    const hashed = await bcrypt.hash(password, 10);
    const wallet = ethers.Wallet.createRandom();

    const user = await User.create({
      email,
      password: hashed,
      walletAddress: wallet.address,
      privateKey: wallet.privateKey,
      role: "user"
    });

    res.json({ email: user.email, walletAddress: user.walletAddress });
  } catch (err) {
    res.status(500).json({ error: "회원가입 실패", reason: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "로그인 실패" });
  }

  const token = jwt.sign({ email: user.email, role: user.role }, "secret", { expiresIn: "1h" });

  res.json({ token, walletAddress: user.walletAddress });
});

module.exports = router;
