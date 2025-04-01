FROM node:18-alpine
WORKDIR /client
COPY package.json package-lock.json ./
COPY . .
EXPOSE 3000
CMD npm install ; npm run build ; npm start