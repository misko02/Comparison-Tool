FROM node:18-alpine
WORKDIR /client
ENV PATH /client/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm start 