FROM node:lts-alpine3.19

WORKDIR /backend

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]




