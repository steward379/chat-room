//src/services/chatService.js
const prisma = require('../config/prisma');

const chatService = {
  async createMessage(userId, content) {
    return prisma.message.create({
      data: {
        content,
        user_id: userId
      }
    });
  },

  async getMessages(limit = 50, offset = 0) {
    return prisma.message.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true
          }
        }
      }
    });
  }
};

module.exports = chatService;