// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  walletAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'wallet_address',
  },
  privateKey: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'private_key',
  },
  tokenBalance: {
    type: DataTypes.DECIMAL(36, 18),
    allowNull: true,
    defaultValue: 0,
    field: 'token_balance',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  role: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'user',
  }
}, {
  tableName: 'users',
  timestamps: false // created_at이 자동 생성이 아니라면 true에서 false로
});

module.exports = User;
