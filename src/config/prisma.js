// src/config/prisma.js

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/chatroom',
      },
    },
  });

module.exports = prisma