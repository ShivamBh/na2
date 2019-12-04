FROM node:8.12-alpine
RUN apk add g++ make python
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build