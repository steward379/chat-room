const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://localhost:6379' // 根據你的 Redis 伺服器地址和端口進行修改
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect();

module.exports = redisClient;