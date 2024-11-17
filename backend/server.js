import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

import { createServer } from 'http';
import { Server } from 'socket.io';

import { Sequelize, DataTypes } from 'sequelize';
import initModels from './infrastructure/database/models/index.js';
import * as path from "node:path";
import * as fs from "node:fs";
import {setupRestaurantModule} from "./config/setupRestaurantModule.js";
import {setupMenuItemModule} from "./config/setupMenuItemModule.js";
import {setupOrderModule} from "./config/setupOrderModule.js";

dotenv.config();

// Initialize express app
const app = express();
const upload = multer();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
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

// Initialize cache with no TTL because the pollig mechanism will do it for us.
const cache = new NodeCache();

app.use(
    cors({
        origin: ['http://localhost:4321', 'http://localhost:4322'],
    }),
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:4321', 'http://localhost:4322'],
        methods: ['GET', 'POST'],
    },
});

async function pollForDatabaseChanges() {
    try {
        cache.del(CACHE_KEYS.RESTAURANTS);
        cache.del(CACHE_KEYS.MENU_ITEMS);

        await fetchDataWithCache(CACHE_KEYS.RESTAURANTS, fetchRestaurantsFromDB);
        await fetchDataWithCache(CACHE_KEYS.MENU_ITEMS, fetchMenuItemsFromDB);
    } catch (error) {
        console.error(`Error polling database:`, error);
    }
}

// Set up polling to run every minute.
setInterval(pollForDatabaseChanges, 10000);

const CACHE_KEYS = {
    RESTAURANTS: 'restaurants',
    MENU_ITEMS: 'menu_items',
    ORDERS: 'orders',
    ORDER_STATUSES: 'order_statuses',
};

async function fetchDataWithCache(cacheKey, fetchFunction) {
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`Returning cached data for ${cacheKey}`);
        return cachedData;
    }

    try {
        console.log(`Fetching fresh data for ${cacheKey}`);
        const data = await fetchFunction();
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching data for ${cacheKey}:`, error);
        throw error;
    }
}

async function fetchRestaurantsFromDB() {
    const restaurants = await models.Restaurant.findAll({
        attributes: [
            'restaurant_id',
            'restaurant_name',
            'description',
            'latitude',
            'longitude',
            'logo',
            'image0',
            'image1',
            'image2',
            'image3',
            'image4',
            'created_at',
        ],
    });

    return restaurants.map((restaurant) => restaurant.get({ plain: true }));
}

async function fetchMenuItemsFromDB() {
    const menuItems = await models.MenuItem.findAll();
    return menuItems.map((item) => item.get({ plain: true }));
}

async function initializeDatabase() {
    try {
        await initializeOrderStatuses();
        await initializeFirstUser();
        await initializeInitialRestaurant();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

async function initializeOrderStatuses() {
    const existingStatuses = await models.OrderStatus.count();

    if (existingStatuses === 0) { // Insert only if no statuses exist
        const statusesToInsert = [
            { status_id: 1, status_name: 'Aguardando aceptación' },
            { status_id: 2, status_name: 'Aceptado' },
            { status_id: 3, status_name: 'Rechazado' },
            { status_id: 4, status_name: 'En preparación' },
            { status_id: 5, status_name: 'Listo para ser retirado' },
            { status_id: 6, status_name: 'Pronto a ser servido' },
        ];
        await models.OrderStatus.bulkCreate(statusesToInsert);
        console.log('Order statuses inserted successfully.');
    } else {
        console.log('Order statuses already exist. Skipping insertion.');
    }
}

async function initializeFirstUser() {
    const firstUser = await models.User.findByPk(1);

    if (!firstUser) {
        await models.User.create({ user_id: 1, username: 'Pepe' });
        console.log('User "Pepe" created.');
    } else {
        console.log('User with ID 1 already exists.');
    }
}

async function initializeInitialRestaurant() {
    const existingRestaurants = await models.Restaurant.count();

    if (existingRestaurants === 0) {
        const restaurantData = await createInitialRestaurantData();
        await models.Restaurant.create(restaurantData);

        const menuItemsToInsert = [
            { restaurant_id: 1, name: 'Café con leche', description: 'Café tradicional argentino con leche', price: 8.00 },
            { restaurant_id: 1, name: 'Medialunas', description: 'Medialunas dulces argentinas', price: 3.50 },
            { restaurant_id: 1, name: 'Tostado', description: 'Sándwich de jamón y queso tostado', price: 10.00 },
            { restaurant_id: 1, name: 'Jugo de naranja', description: 'Jugo de naranja exprimido', price: 6.00 },
            { restaurant_id: 1, name: 'Factura', description: 'Factura dulce', price: 4.00 },
        ];

        await models.MenuItem.bulkCreate(menuItemsToInsert);
        console.log('Initial menu items inserted successfully.');
    } else {
        console.log('Restaurants already exist. Skipping insertion.');
    }
}

async function createInitialRestaurantData() {
    const logoPath = path.join('initial_restaurants', 'cafeteria_pepe_logo.jpg');
    const mainImagePath = path.join('initial_restaurants', 'cafeteria_pepe_imagen_1.png');
    const secundaryImagePath = path.join('initial_restaurants', 'cafeteria_pepe_imagen_2.png');

    const logoData = fs.readFileSync(logoPath);
    const mainImageData = fs.readFileSync(mainImagePath);
    const secundaryImageData = fs.readFileSync(secundaryImagePath);

    return {
        restaurant_name: 'Cafetería de Pepe',
        description: 'Buen café a buen precio',
        latitude: -34.53682788,
        longitude: -58.44516277,
        logo: logoData,
        image0: mainImageData,
        image1: secundaryImageData,
        image2: mainImageData,
        image3: secundaryImageData,
        image4: mainImageData,
    };
}

app.get('/orderStatuses', async (req, res) => {
    try {
        const statuses = await models.OrderStatus.findAll({
            attributes: ['status_id', 'status_name'],
        });
        res.json(statuses);
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).json({ error: 'An error occurred while fetching order statuses' });
    }
});

// NEW LOGIC IS HERE

const restaurantModule = setupRestaurantModule(models);
const menuItemModule = setupMenuItemModule(models);
const orderModule = setupOrderModule(models);

app.use(restaurantModule.router);
app.use(menuItemModule.router);
app.use(orderModule.router);


// NEW LOGIC IS HERE

// Use this endpoint in case you want to manually invalidate the cache for a specific sheet
app.post('/invalidate-cache', (req, res) => {
    const { sheetName } = req.body;

    if (!sheetName) {
        return res.status(400).json({ error: 'Sheet name is required' });
    }

    const cacheKey = `sheet_${sheetName}`;

    if (cache.del(cacheKey)) {
        console.log(`Cache invalidated for sheet: ${sheetName}`);
        res.status(200).json({ message: `Cache invalidated for sheet: ${sheetName}` });
    } else {
        res.status(404).json({ error: `No cache found for sheet: ${sheetName}` });
    }
});

const PORT = process.env.PORT || 5001;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('addToCart', async (items) => {
        try {
            // Validate that 'items' is an array and it's not empty
            if (!Array.isArray(items) || items.length === 0) {
                throw new Error('Invalid or empty items list');
            }

            // Start a transaction
            const transaction = await sequelize.transaction();

            try {
                // Find the pending order status
                const pendingStatus = await models.OrderStatus.findOne({
                    where: { status_name: 'Aguardando aceptación' },
                    transaction: transaction,
                });

                if (!pendingStatus) {
                    throw new Error('Pending OrderStatus not found');
                }

                // Create a new order
                const order = await models.Order.create({
                    user_id: items[0].userId, // Assuming all items have the same userId
                    restaurant_id: items[0].restaurantId, // Assuming all items have the same restaurantId
                    status_id: pendingStatus.status_id,
                }, { transaction: transaction });

                // Prepare the order items data for bulk create
                const orderItemsData = items.map(item => ({
                    order_id: order.order_id,
                    item_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }));

                // Bulk create order items
                const orderItems = await models.OrderItem.bulkCreate(orderItemsData, { transaction: transaction });

                // Fetch the full order items with related data (for response and emitting)
                // Since bulkCreate doesn't return the full instances with associations,
                // we need to fetch them using findAll with the IDs of created order items.
                const fullOrderItems = await models.OrderItem.findAll({
                    where: {
                        order_item_id: orderItems.map(item => item.order_item_id)
                    },
                    include: [
                        {
                            model: models.MenuItem,
                            attributes: ['name', 'description'],
                        },
                        {
                            model: models.Order,
                            include: [
                                {
                                    model: models.OrderStatus,
                                    attributes: ['status_name'],
                                },
                                {
                                    model: models.Restaurant,
                                    attributes: ['restaurant_id', 'restaurant_name'],
                                },
                            ],
                        },
                    ],
                    transaction: transaction,
                });

                // Commit the transaction
                await transaction.commit();

                const cartItems = fullOrderItems.map(fullOrderItem => ({
                    id: fullOrderItem.order_id, // Or order_item_id if you prefer
                    name: fullOrderItem.MenuItem.name,
                    price: fullOrderItem.price,
                    quantity: fullOrderItem.quantity,
                    status: fullOrderItem.Order.OrderStatus.status_name,
                    restaurantId: fullOrderItem.Order.Restaurant.restaurant_id,
                    restaurantName: fullOrderItem.Order.Restaurant.restaurant_name,
                }));

                io.emit('cartUpdated', cartItems); // Emit the array of cart items

                // TODO: THIS IS NOT USED YET: Emit something to update the comanda too.
                const responseForComandas = {
                    id: order.order_id,
                    user: order.user_id.username || 'Jorge', // Debugging placeholder
                    status: pendingStatus.status_name,
                    items: fullOrderItems.map(fullOrderItem => ({
                        productId: fullOrderItem.item_id,
                        name: fullOrderItem.MenuItem.name,
                        quantity: fullOrderItem.quantity,
                        comments: 'Sin comentarios', // TODO: Allow users to add comments
                    })),
                    created_at: order.created_at,
                }

                io.emit('newOrderCreated', responseForComandas);

            } catch (error) {
                // Rollback the transaction in case of any error
                await transaction.rollback();
                throw error; // Re-throw the error to be caught in the outer catch block
            }
        } catch (error) {
            console.error('Error adding items to cart:', error);
            socket.emit('error', 'Failed to add items to cart');
        }
    });

    socket.on('fetchCart', async (userId) => {
        try {
            const orders = await models.Order.findAll({
                where: {
                    user_id: userId,
                },
                include: [
                    {
                        model: models.OrderItem,
                        include: [
                            {
                                model: models.MenuItem,
                                attributes: ['name', 'description'],
                            },
                        ],
                    },
                    {
                        model: models.Restaurant,
                        attributes: ['restaurant_id', 'restaurant_name'],
                    },
                    {
                        model: models.OrderStatus,
                        attributes: ['status_name'],
                    },
                ],
            });

            let cartItems = [];

            // TODO: Transform this data somewhere else.
            orders.forEach((order) => {
                const orderItems = order.OrderItems.map((item) => ({
                    id: item.order_id, // TODO: Maybe send the order_item_id too...
                    name: item.MenuItem.name,
                    price: item.price,
                    quantity: item.quantity,
                    status: order.OrderStatus.status_name,
                    restaurantId: order.Restaurant.restaurant_id,
                    restaurantName: order.Restaurant.restaurant_name,
                }));
                cartItems = cartItems.concat(orderItems);
            });

            socket.emit('cartFetched', cartItems);
        } catch (error) {
            console.error('Error fetching cart:', error);
            socket.emit('error', 'Failed to fetch cart');
        }
    });

    socket.on('updateOrderStatus', async ({ orderId, newStatusId }) => {
        try {
            const order = await models.Order.findByPk(orderId, {
                include: [{ model: models.OrderStatus }],
            });
            if (!order) {
                throw new Error('Order not found');
            }

            const newStatus = await models.OrderStatus.findByPk(newStatusId);
            if (!newStatus) {
                throw new Error('Invalid status');
            }

            order.status_id = newStatusId;
            await order.save();

            console.log('Order status updated successfully');

            console.log(orderId);

            io.emit('orderStatusUpdated', {
                orderId,
                newStatus: newStatus.status_name,
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            socket.emit('error', 'Failed to update order status');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected.');
    });
});

// Replace app.listen with httpServer.listen
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    pollForDatabaseChanges();
    initializeDatabase();
});
