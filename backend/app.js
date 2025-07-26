require("dotenv").config();

// 확인용 로그
console.log("🔐 PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("🌐 RPC_URL:", process.env.RPC_URL);
console.log("📦 TOKEN_ADDRESS:", process.env.TOKEN_ADDRESS);

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/token");

const app = express();
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);

// backend/app.js
const sequelize = require('./config/db');
// ... 기존 코드 생략

sequelize.sync().then(() => {
  console.log("✅ DB 연결 및 모델 동기화 완료");
  app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ DB 연결 실패:", err);
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
