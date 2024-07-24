const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const prisma = require('./config/prisma');
const tokenUtils = require('./utils/tokenUtils');
const redisClient = require('./utils/redisClient');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

const clients = new Map();

wss.on('connection', async (ws, req) => {
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
  
  if (!token) {
    ws.close(1008, 'Token missing');
    return;
  }

  let decoded;
  try {
    decoded = tokenUtils.verifyToken(token);
  } catch (err) {
    console.error('WebSocket token verification failed:', err);
    ws.close(1008, 'Invalid token');
    return;
  }

  const userId = decoded.id;
  console.log('New client connected, user ID:', userId);

  const recentMessages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { created_at: 'asc' },
    take: 50
  });

  recentMessages.forEach((msg) => {
    ws.send(JSON.stringify({
      type: 'chat',
      id: msg.id,
      nickname: msg.user.nickname, 
      message: msg.content
    }));
  });

  ws.on('message', async (message) => {
    const data = JSON.parse(message);

    if (data.type === 'setNickname') {
      if ([...clients.values()].some(client => client.nickname === data.nickname)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Nickname already taken' }));
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        ws.send(JSON.stringify({ type: 'error', message: 'User not found' }));
        return;
      }

      clients.set(ws, { nickname: data.nickname, userId: user.id });
      ws.send(JSON.stringify({ type: 'nicknameSet', nickname: data.nickname }));
    } else if (data.type === 'chat') {
      const client = clients.get(ws);
      if (client) {
        const savedMessage = await prisma.message.create({
          data: {
            content: data.message,
            user_id: client.userId
          }
        });

        await redisClient.del('messages');

        wss.clients.forEach((clientWs) => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({
              type: 'chat',
              id: savedMessage.id,
              nickname: client.nickname,
              message: data.message
            }));
          }
        });
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

app.get('/auth/validate', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = tokenUtils.verifyToken(token);
    res.json({ valid: true, userId: decoded.id });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

app.get('/messages', async (req, res) => {
  const cacheMessages = await redisClient.get('messages');
  if (cacheMessages) {
    return res.json(JSON.parse(cacheMessages));
  }

  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { created_at: 'asc' },
    take: 50
  });

  await redisClient.set('messages', JSON.stringify(messages), { EX: 60 * 5 });
  res.json(messages);
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong:", err });
});


// 數據庫連接檢查
const checkDatabaseConnections = async () => {
  try {
    // 檢查 PostgreSQL 連接
    await prisma.$connect();
    console.log('PostgreSQL connected successfully');
    
    // 檢查 Redis 連接
    const redisPing = await redisClient.ping();
    if (redisPing === 'PONG') {
      console.log('Redis connected successfully');
    } else {
      throw new Error('Redis ping failed');
    }
  } catch (error) {
    console.error('Error connecting to databases:', error);
    process.exit(1); // 如果連接失敗，退出程序
  }
};

// 優雅關閉
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
  });
  
  wss.clients.forEach(client => {
    client.close();
  });

  try {
    await prisma.$disconnect();
    console.log('PostgreSQL disconnected');
    await redisClient.quit();
    console.log('Redis disconnected');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// 啟動賜福器
const startServer = async () => {
  await checkDatabaseConnections();

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port http://127.0.0.1:${PORT}`);
  });
};

startServer();

// 監聽終止信號
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app;