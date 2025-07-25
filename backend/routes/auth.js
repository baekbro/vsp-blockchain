const express = require("express");
const router = express.Router();
const pool = require("../db");
const { Wallet } = require("ethers");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 10);
    const wallet = Wallet.createRandom();

    await pool.query(
      "INSERT INTO users (email, password, wallet_address, private_key) VALUES (?, ?, ?, ?)",
      [email, hashedPw, wallet.address, wallet.privateKey]
    );

    res.status(201).json({ message: "회원가입 성공", walletAddress: wallet.address });
} catch (err) {
    console.error("❌ 회원가입 실패:", err);
    res.status(500).json({ error: "회원가입 실패", reason: err.message });
  }  
});

// 추가된 코드
const jwt = require("jsonwebtoken"); // 토큰 발급용 (선택)

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "존재하지 않는 사용자입니다" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "비밀번호가 일치하지 않습니다" });
    }

    // 토큰 발급 (선택)
    const token = jwt.sign({ userId: user.id }, "your-secret-key", { expiresIn: "1h" });

    res.json({
      message: "로그인 성공",
      walletAddress: user.wallet_address,
      token, // 선택: 클라이언트가 저장 가능
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "로그인 실패" });
  }
});

router.post("/register", async (req, res) => {
  const { walletAddress, password } = req.body;
  // 회원가입 로직
});

module.exports = router;
