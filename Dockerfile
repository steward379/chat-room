FROM node:20.9.0

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpx prisma generate

EXPOSE 3000

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/bin/bash", "-c", "/wait-for-it.sh postgres:5432 -- /wait-for-it.sh redis:6379 -- pnpm start"]

# CMD ["node", "src/app.js"]