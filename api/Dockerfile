FROM node:latest

MAINTAINER Luis Rojas

WORKDIR /var/www/app

COPY ./package.json ./

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
