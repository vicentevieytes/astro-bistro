import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { Server } from 'socket.io';

import { Sequelize } from 'sequelize';
import initModels from './infrastructure/database/models/index.js';
import {setupRestaurantModule} from "./config/setupRestaurantModule.js";
import {setupMenuItemModule} from "./config/setupMenuItemModule.js";
import {setupOrderModule} from "./config/setupOrderModule.js";
import {setupWebSocketModule} from "./config/setupWebSocketModule.js";
import {setupUserModule} from "./config/setupUserModule.js";
import {initializeDatabase} from "./config/initializeDatabase.js";

dotenv.config();

// Initialize express app
const app = express();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    retry: {
        match: [/ECONNREFUSED/],
        max: 8,  // Number of retries
        backoffBase: 1000,  // Initial backoff duration in ms
        backoffExponent: 1.5  // Exponential backoff factor
    }
});

// Test the connection
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
    // TODO: Remove this, maybe retry.
    process.exit(1);
}

const models = initModels(sequelize);
sequelize.sync();

app.use(
    cors({
        origin: [process.env.PUBLIC_CONSUMIDOR_FE_URL, process.env.PUBLIC_RESTAURANTE_FE_URL, process.env.INTERNAL_CONSUMIDOR_FE_URL, process.env.INTERNAL_RESTAURANTE_FE_URL],
    }),
);

console.log(`PUBLIC_CONSUMIDOR_FE_URL: ${process.env.PUBLIC_CONSUMIDOR_FE_URL}`);
console.log(`PUBLIC_RESTAURANTE_FE_URL: ${process.env.PUBLIC_RESTAURANTE_FE_URL}`);
console.log(`INTERNAL_CONSUMIDOR_FE_URL: ${process.env.INTERNAL_CONSUMIDOR_FE_URL}`);
console.log(`INTERNAL_RESTAURANTE_FE_URL: ${process.env.INTERNAL_RESTAURANTE_FE_URL}`);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.PUBLIC_CONSUMIDOR_FE_URL, process.env.PUBLIC_RESTAURANTE_FE_URL, process.env.INTERNAL_CONSUMIDOR_FE_URL, process.env.INTERNAL_RESTAURANTE_FE_URL],
        methods: ['GET', 'POST'],
    },
});

const restaurantModule = setupRestaurantModule(models);
const menuItemModule = setupMenuItemModule(models);
const orderModule = setupOrderModule(models);
const userModule = setupUserModule(models);

app.use(restaurantModule.router);
app.use(menuItemModule.router);
app.use(orderModule.router);
app.use(userModule.router);


const PORT = process.env.PORT || 5001;

const webSocketModule = setupWebSocketModule(models);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('addOrder', (items) =>
        webSocketModule.controller.addOrder(socket, io, items));

    socket.on('fetchOrders', (userId) =>
        webSocketModule.controller.fetchOrders(socket, userId));

    socket.on('updateOrderStatus', (data) =>
        webSocketModule.controller.updateOrderStatus(socket, io, data));

    socket.on('disconnect', () => {
        console.log('User disconnected.');
    });
});

// Replace app.listen with httpServer.listen
httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    initializeDatabase(models);
    console.log("Database data initialized");
});

