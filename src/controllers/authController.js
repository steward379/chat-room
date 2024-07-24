//src/controllers/authController.js

const userService = require('../services/userService');
const tokenUtils = require('../utils/tokenUtils');

const authController = {
  async register(req, res) {
    try {
      // const { username, password, email, nickname, avatar } = req.body;
      const { username, password, email, nickname } = req.body;
      const avatar = req.body.avatar || null;
      const existingUser = await userService.findUserByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const newUser = await userService.createUser({ username, password, email, nickname, avatar });
      const token = tokenUtils.generateToken(newUser.id);

      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userService.findUserByUsername(username);

      if (!user || !(await userService.validatePassword(user, password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = tokenUtils.generateToken(user.id);
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  },
  
  async logout(req, res) {
    // 模擬登出邏輯，實際上應該將 token 加入黑名單
    res.json({ message: 'Logout successful' });
  }
};

module.exports = authController;