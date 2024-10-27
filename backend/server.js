import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { convertToJSON } from '../frontend-consumidor/src/utils/auxiliary.js';
import NodeCache from 'node-cache';

import { createServer } from 'http';
import { Server } from 'socket.io';

import { Sequelize, DataTypes } from 'sequelize';
import initModels from './orm_models/index.js';

dotenv.config();

// Initialize express app
const app = express();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
    }
);


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
        methods: ['GET', 'POST']
    }
});


async function pollForDatabaseChanges() {
    try {
        await fetchDataWithCache(CACHE_KEYS.RESTAURANTS, fetchRestaurantsFromDB);
        await fetchDataWithCache(CACHE_KEYS.MENU_ITEMS, fetchMenuItemsFromDB);
        // Add similar calls for other entities (orders, order statuses)
    } catch (error) {
        console.error(`Error polling database:`, error);
    }
}


// Set up polling to run every minute.
setInterval(pollForDatabaseChanges, 600000);

const CACHE_KEYS = {
    RESTAURANTS: 'restaurants',
    MENU_ITEMS: 'menu_items',
    ORDERS: 'orders',
    ORDER_STATUSES: 'order_statuses'
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
        attributes: ['restaurant_id', 'restaurant_name', 'description', 'latitude', 'longitude', 'created_at']
    });
    return restaurants.map(restaurant => restaurant.get({ plain: true }));
}

async function fetchMenuItemsFromDB() {
    const menuItems = await models.MenuItem.findAll();
    return menuItems.map(item => item.get({ plain: true }));
}


// app.get('/Restaurante', async (req, res) => {
//     try {
//         const data = await fetchSheetDataWithCache(RESTAURANTE_SHEET_NAME);
//         res.send(convertToJSON(data.values));
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while fetching data' });
//     }
// });

app.get('/Restaurante', async (req, res) => {
    try {
        const restaurantsData = await fetchDataWithCache(CACHE_KEYS.RESTAURANTS, fetchRestaurantsFromDB);
        res.json(restaurantsData);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});


// app.get('/local', async (req, res) => {
//     const id = req.query.id;
//     try {
//         const data = await fetchSheetDataWithCache(RESTAURANTE_SHEET_NAME);
//         const localData = data.values.filter((row) => row[0] === id || row[0] === 'id');
//         res.send(convertToJSON(localData));
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while fetching data' });
//     }
// });

app.get('/local', async (req, res) => {
    const id = req.query.id;
    try {
        const restaurants = await fetchDataWithCache(CACHE_KEYS.RESTAURANTS, fetchRestaurantsFromDB);
        const restaurant = restaurants.find(r => r.restaurant_id === parseInt(id));
        if (restaurant) {
            res.json(restaurant);
        } else {
            res.status(404).json({ error: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});


// app.get('/menu', async (req, res) => {
//     const id = req.query.id;
//     try {
//         const data = await fetchSheetDataWithCache(MENU_SHEET_NAME);
//         const localData = data.values.filter((row) => row[1] === id || row[0] === 'id');
//         res.send(convertToJSON(localData));
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while fetching data' });
//     }
// });

app.get('/menu', async (req, res) => {
    const restaurantId = req.query.id;
    try {
        const menuItems = await fetchDataWithCache(CACHE_KEYS.MENU_ITEMS, fetchMenuItemsFromDB);
        const filteredItems = menuItems.filter(item => item.restaurant_id === parseInt(restaurantId));
        res.json(filteredItems);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});


// app.get('/comandas', async (req, res) => {
//     const id = req.query.id;
//     try {
//         const data = await fetchSheetDataWithCache(COMANDA_SHEET_NAME);
//         const localData = data.values.filter((row) => row[0] === id || row[0] === 'id');
//         res.send(convertToJSON(localData));
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while fetching data' });
//     }
// });

app.get('/comandas', async (req, res) => {
    const restaurantId = req.query.id;
    try {
        const orders = await models.Order.findAll({
            where: { restaurant_id: restaurantId },
            include: [
                {
                    model: models.OrderItem,
                    include: [
                        {
                            model: models.MenuItem,
                            attributes: ['name']
                        }
                    ]
                },
                {
                    model: models.OrderStatus,
                    attributes: ['status_name']
                },
                {
                    model: models.User,
                    attributes: ['username']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        const comandas = orders.map(order => ({
            id: order.order_id,
            user: order.User.username,
            status: order.OrderStatus.status_name,
            items: order.OrderItems.map(item => ({
                productId: item.item_id,
                name: item.MenuItem.name,
                quantity: item.quantity,
                comments: item.comments || 'Sin comentarios'
            })),
            created_at: order.created_at
        }));

        res.json(comandas);
    } catch (error) {
        console.error('Error fetching comandas:', error);
        res.status(500).json({ error: 'An error occurred while fetching comandas' });
    }
});

app.get('/orderStatuses', async (req, res) => {
    try {
        const statuses = await models.OrderStatus.findAll({
            attributes: ['status_id', 'status_name']
        });
        res.json(statuses);
    } catch (error) {
        console.error('Error fetching order statuses:', error);
        res.status(500).json({ error: 'An error occurred while fetching order statuses' });
    }
});

app.post('/crear-restaurante', async (req, res) => {
    // Let's throw an error because this is not implemented yet.
    res.status(500).json({ error: 'Not implemented yet' });
    // const { nombre, latitud, longitud, descripcion, platos } = req.body;
    //
    // // Obtén los datos actuales de la hoja de cálculo
    // const data = await fetchSheetDataWithCache(RESTAURANTE_SHEET_NAME);
    //
    // // Encuentra el máximo ID existente
    // const existingIds = data.values.map(row => row[0]); // Asumiendo que el ID está en la primera columna
    // const maxId = Math.max(...existingIds.filter(id => !isNaN(id)).map(Number)); // Filtrar y convertir a números
    // const newId = maxId + 1; // Generar nuevo ID
    //
    // // Formato del objeto final
    // const restaurantData = {
    //     id: newId,
    //     nombre,
    //     lat: latitud,
    //     len: longitud,
    //     descripcion,
    //     platos
    // };
    //
    // // Obtén los datos actuales de la hoja de cálculo para los platos
    // const menuData = await fetchSheetDataWithCache(MENU_SHEET_NAME);
    //
    // // Encuentra el máximo ID existente para los platos
    // const existingPlateIds = menuData.values.map(row => row[0]); // Asumiendo que el ID de plato está en la primera columna
    // const maxPlateId = Math.max(...existingPlateIds.filter(id => !isNaN(id)).map(Number)); // Filtrar y convertir a números
    //
    // try {
    //     // Formatear los datos para agregar a la hoja de cálculo
    //     const formattedRestaurantData = [
    //         restaurantData.id,
    //         restaurantData.nombre,
    //         restaurantData.lat,
    //         restaurantData.len,
    //         restaurantData.descripcion,
    //     ];
    //
    //     // Llamar a la función que actualiza los datos en la hoja de cálculo
    //     await appendSheetData(RESTAURANTE_SHEET_NAME, [formattedRestaurantData]);
    //
    //     const formattedPlatosData = platos.map((plato, index) => [
    //         maxPlateId + index + 1,
    //         restaurantData.id,
    //         plato.nombre,
    //         plato.precio,
    //         plato.descripcion
    //     ]);
    //
    //     // Llamar a la función que actualiza los datos en la hoja de cálculo del Menu
    //     await appendSheetData(MENU_SHEET_NAME, formattedPlatosData);
    //
    //     // Enviar una respuesta exitosa
    //     res.status(200).json({ message: 'Restaurante con su menu creado exitosamente' });
    // } catch (error) {
    //     console.error('Error al crear el restaurante:', error);
    //     res.status(500).json({ error: 'Ocurrió un error al crear el restaurante' });
    // }
});

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

    socket.on('addToCart', async (item) => {
        try {
            // First, make sure we have a valid OrderStatus for Pending orders
            const pendingStatus = await models.OrderStatus.findOne({ where: { status_name: 'Aguardando aceptación' } });

            if (!pendingStatus) {
                throw new Error('Pending OrderStatus not found');
            }

            // TODO: Allow different items to belong to the same order.

            let order = await models.Order.create({
                user_id: item.userId,
                restaurant_id: item.restaurantId,
                status_id: pendingStatus.status_id  // Use the actual status_id from the database
            });

            console.log(item);
            console.log("EPA")

            const orderItem = await models.OrderItem.create({
                order_id: order.order_id,
                item_id: item.id,
                quantity: item.quantity,
                price: item.price
            });

            const fullOrderItem = await models.OrderItem.findOne({
                where: { order_item_id: orderItem.order_item_id },
                include: [
                    {
                        model: models.MenuItem,
                        attributes: ['name', 'description']
                    },
                    {
                        model: models.Order,
                        include: [
                            {
                                model: models.OrderStatus,
                                attributes: ['status_name']
                            },
                            {
                                model: models.Restaurant,
                                attributes: ['restaurant_id', 'restaurant_name']
                            }
                        ]
                    }
                ]
            });

            // TODO: Transform this data somewhere else.
            const response = {
                id: fullOrderItem.order_id, // TODO: We are sending the order id instead of the order_item_id.
                                            //  We should send both.
                name: fullOrderItem.MenuItem.name,
                price: fullOrderItem.price,
                quantity: fullOrderItem.quantity,
                status: fullOrderItem.Order.OrderStatus.status_name,
                restaurantId: fullOrderItem.Order.Restaurant.restaurant_id,
                restaurantName: fullOrderItem.Order.Restaurant.restaurant_name
            };

            io.emit('cartUpdated', response);

            // TODO: THIS IS NOT IMPLEMENTED YET: Emit something to update the comanda too.
            io.emit('newOrderCreated', {
                id: order.order_id,
                user: order.user_id.username || 'Jorge', // Jorge is there for debugging purposes
                status: pendingStatus.status_name,
                items: [{
                    productId: orderItem.item_id,
                    name: fullOrderItem.MenuItem.name,
                    quantity: orderItem.quantity,
                    comments: 'Sin comentarios' // TODO: Allow users to add comments
                }],
                created_at: order.created_at
            });


        } catch (error) {
            console.error('Error adding item to cart:', error);
            socket.emit('error', 'Failed to add item to cart');
        }
    });

    socket.on('fetchCart', async (userId) => {
        try {
            const orders = await models.Order.findAll({
                where: {
                    user_id: userId
                },
                include: [{
                    model: models.OrderItem,
                    include: [{
                        model: models.MenuItem,
                        attributes: ['name', 'description']
                    }]
                }, {
                    model: models.Restaurant,
                    attributes: ['restaurant_id', 'restaurant_name']
                }, {
                    model: models.OrderStatus,
                    attributes: ['status_name']
                }]
            });

            let cartItems = [];

            // TODO: Transform this data somewhere else.
            orders.forEach(order => {
                const orderItems = order.OrderItems.map(item => ({
                    id: item.order_id, // TODO: Maybe send the order_item_id too...
                    name: item.MenuItem.name,
                    price: item.price,
                    quantity: item.quantity,
                    status: order.OrderStatus.status_name,
                    restaurantId: order.Restaurant.restaurant_id,
                    restaurantName: order.Restaurant.restaurant_name
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
                include: [{ model: models.OrderStatus }]
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

            console.log("Order status updated successfully");

            console.log(orderId)


            io.emit('orderStatusUpdated', {
                orderId,
                newStatus: newStatus.status_name
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
});
