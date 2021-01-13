FROM node:9.2.0
LABEL author="Ilya Amelevich <ilya.amelevich@ya.ru>"

ENV APP_ENV production
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y libcairo2-dev libjpeg62-turbo-dev libgif-dev build-essential g++
RUN npm install pm2 -g --silent

COPY ["package.json", "package-lock.json", "./"]
RUN npm install --production --silent
COPY . .
RUN mkdir -p ./protected/runtime/cache
RUN mkdir -p ./protected/runtime/logs
RUN mkdir -p ./protected/runtime/logs/json
RUN mkdir -p ./protected/runtime/tmp

EXPOSE 3000
CMD pm2-docker start ecosystem.config.js