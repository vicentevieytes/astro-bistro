FROM node:22-bullseye

WORKDIR /app

RUN mkdir -p frontend-consumidor frontend-restaurante

# Copy package.json and package-lock.json to install dependencies
COPY package.json .
COPY frontend-consumidor/package.json frontend-consumidor/package.json
COPY frontend-restaurante/package.json frontend-restaurante/package.json

RUN npm install
RUN npm run install-consumidor
RUN npm run install-restaurante

# Copy the rest of the application files
COPY . .

EXPOSE 5001
EXPOSE 5432
EXPOSE 5431



