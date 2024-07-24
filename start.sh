#!/bin/bash

# 檢查 PostgreSQL 是否運行，如果沒有則啟動
if ! brew services list | grep postgresql | grep started > /dev/null; then
    echo "Starting PostgreSQL..."
    brew services start postgresql
fi

# 檢查 Redis 是否運行，如果沒有則啟動
if ! brew services list | grep redis | grep started > /dev/null; then
    echo "Starting Redis..."
    brew services start redis
fi

# 等待服務完全啟動
sleep 3

# 啟動您的 Node.js 應用
echo "Starting Node.js application..."
node src/app.js