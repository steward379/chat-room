// src/app.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { created_at: 'asc' },
    take: 50 // Limit to last 50 messages
  });
  res.json(messages);
});

app.get('/api/messages', async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { created_at: 'desc' },
    take: 10
  });
  res.json(messages);
});

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', async (message) => {
    const data = JSON.parse(message);
    console.log('Received:', data);

    if (data.type === 'setNickname') {
      if ([...clients.values()].some(client => client.nickname === data.nickname)) {
        ws.send(JSON.stringify({ type: 'error', message: 'Nickname already taken' }));
        return;
      }
      let user = await prisma.user.findFirst({ where: { nickname: data.nickname } });
      if (!user) {
        // Create a temporary user
        const tempUsername = `temp_${Date.now()}`;
        const tempPassword = await bcrypt.hash(tempUsername, 10);
        user = await prisma.user.create({
          data: {
            username: tempUsername,
            password: tempPassword,
            email: `${tempUsername}@temp.com`,
            nickname: data.nickname
          }
        });
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port http://127.0.0.1:${PORT}`);
});

module.exports = app;