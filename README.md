**#** Chat Room Project / 聊天室專案

這個專案是即時聊天室應用程式，讓使用者能夠即時通訊。
整合了 Node.js/Express, WebSocket, 快取 Redis, ORM Prisma, 資料庫 PostgresQL 等等。前端使用 React + Vite。並以 Docker 打包。

This project is a real-time chat room application that allows users to communicate instantly. It combines modern web technologies to create a seamless and efficient chatting experience.

**###** Key Features:
**-** Real-time messaging using WebSocket
**-** User authentication and authorization
**-** Persistent storage of chat history
**-** Scalable architecture with potential for caching and message queuing

**###** Technology Stack:
**-****Frontend:******
**-** React: A JavaScript library for building user interfaces
**-** Vite: Next generation frontend tooling for faster development and building
**-****Backend:******
**-** Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine
**-** Express: Web application framework for Node.js
**-** WebSocket (ws): For real-time, bidirectional communication
**-****Database:******
**-** PostgreSQL: Open-source relational database
**-** Prisma: Next-generation ORM for Node.js and TypeScript
**-****Authentication:******
**-** JSON Web Tokens (JWT): For secure user authentication
**-** bcrypt: For password hashing
**-****Caching/Message Queue:******
**-** Redis: In-memory data structure store (potential use)
**-****Development Tools:******
**-** nodemon: For automatic restarting of Node.js applications during development
**-** concurrently: Run multiple commands concurrently


**###** 主要特點：
**-** 使用 WebSocket 進行即時消息傳遞
**-** 用戶認證和授權
**-** 聊天歷史的永久存儲
**-** 可擴展的架構，具有緩存和消息隊列的潛力

**###** 技術棧：
**-****前端：******
**-** React：用於構建用戶界面的 JavaScript 庫
**-** Vite：下一代前端工具，用於更快的開發和構建
**-****後端：******
**-** Node.js：基於 Chrome V8 JavaScript 引擎的 JavaScript 運行時
**-** Express：Node.js 的 Web 應用程序框架
**-** WebSocket (ws)：用於實時、雙向通信
**-****數據庫：******
**-** PostgreSQL：開源關係型數據庫
**-** Prisma：Node.js 和 TypeScript 的下一代 ORM
**-****認證：******
**-** JSON Web Tokens (JWT)：用於安全的用戶認證
**-** bcrypt：用於密碼哈希
**-****緩存/消息隊列：******
**-** Redis：內存數據結構存儲（潛在用途）
**-****開發工具：******
**-** nodemon：用於在開發過程中自動重啟 Node.js 應用程序
**-** concurrently：同時運行多個命令

**##** Getting Started

**1.** Clone the repository

```
   git clone [repository-url]
```

**2.** Install dependencies 

```
   npm install
```

**3.** Set up environment variables 
**-** Create a **`.env`** file in the root directory / 在根目錄創建 **`.env`** 文件
**-** Add necessary environment variables 

**4.** Run database migrations 

```
   npm run prisma:migrate
```

**5.** Start the development server 

```
   npm run dev
```

**6.** Open your browser and navigate to **`http://localhost:3000`** / 打開瀏覽器並訪問 **`http://localhost:3000`**