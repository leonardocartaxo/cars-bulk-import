FROM node:14

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json ./
RUN npm install -g @nestjs/cli
RUN npm install
RUN npm run build

COPY . ./

EXPOSE 3000
