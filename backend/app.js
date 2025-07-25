const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const tokenRoutes = require("./routes/token");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);

// 예시
const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
