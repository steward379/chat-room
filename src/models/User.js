const { DataTypes } = require('sequelize');
const getSequelize = require('../config/sequelize');
const bcrypt = require('bcryptjs');

const sequelize = getSequelize();

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;