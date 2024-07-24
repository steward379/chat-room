const chatService = require('../services/chatService');

const chatController = {
  async sendMessage(req, res) {
    try {
      const { content } = req.body;
      const userId = req.userId;
      const message = await chatService.createMessage(userId, content);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error: error.message });
    }
  },

  async getMessages(req, res) {
    try {
      const { limit, offset } = req.query;
      const messages = await chatService.getMessages(Number(limit), Number(offset));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving messages', error: error.message });
    }
  }
};

module.exports = chatController;