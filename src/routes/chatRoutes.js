//src/routes/chatRoutes.js

const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.post('/messages', chatController.sendMessage);
router.get('/messages', chatController.getMessages);

module.exports = router; 