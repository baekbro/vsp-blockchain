// backend/middleware/auth.js

const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "인증 토큰 없음" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "토큰 형식 오류" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "토큰 검증 실패" });
  }
};

// ✅ 관리자 인증 미들웨어 추가
const authenticateAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "관리자 권한 없음" });
  }
  next();
};

// ✅ 객체로 내보내기
module.exports = {
  authenticateToken,
  authenticateAdmin,
};
