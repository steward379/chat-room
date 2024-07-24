const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

const userService = {
  async createUser(userData) {
    const { username, password, email, nickname, avatar } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        nickname,
        avatar
      }
    });
  },

  async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  },

  async findUserByUsername(username) {
    return prisma.user.findUnique({
      where: { username }
    });
  },

  async updateUserProfile(userId, profileData) {
    const { nickname, avatar } = profileData;
    return prisma.user.update({
      where: { id: userId },
      data: { nickname, avatar }
    });
  },

  async getUserProfile(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true, nickname: true, avatar: true }
    });
  }
};

module.exports = userService;