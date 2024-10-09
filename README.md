# Chat Room Project / 聊天室專案

這個專案是即時聊天室應用程式，讓使用者能夠即時通訊。
整合了 Node.js/Express, WebSocket, 快取 Redis, ORM Prisma, 資料庫 PostgresQL 等等。前端使用 React + Vite。並以 Docker 打包。

This project is a real-time chat room application that allows users to communicate instantly. It combines modern web technologies to create a seamless and efficient chatting experience.

### Key Features:
- Real-time messaging using WebSocket
- User authentication and authorization
- Persistent storage of chat history
- Scalable architecture with potential for caching and message queuing

### Technology Stack:
Frontend:
- React: A JavaScript library for building user interfaces
- Vite: Next generation frontend tooling for faster development and building

Backend:
- Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine
- Express: Web application framework for Node.js
- WebSocket (ws): For real-time, bidirectional communication

Database:
- PostgreSQL: Open-source relational database
- Prisma: Next-generation ORM for Node.js and TypeScript

Authentication:
- JSON Web Tokens (JWT): For secure user authentication
- bcrypt: For password hashing

Caching/Message Queue:
- Redis: In-memory data structure store (potential use)

Development Tools:
- nodemon: For automatic restarting of Node.js applications during development
- concurrently: Run multiple commands concurrently

## Getting Started

1. Clone the repository

```
   git clone [repository-url]
```

2. Install dependencies 

```
   npm install
```

3. Set up environment variables 
- Create a **`.env`** file in the root directory / 在根目錄創建 **`.env`** 文件
- Add necessary environment variables 

4. Run database migrations 

```
   npm run prisma:migrate
```

5. Start the development server 

```
   npm run dev
```

6. Open your browser and navigate to **`http://localhost:3000`** / 打開瀏覽器並訪問 **`http://localhost:3000`**
