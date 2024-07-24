FROM node:14

# 安裝 pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpx prisma generate

EXPOSE 3000

CMD ["pnpm", "start"]