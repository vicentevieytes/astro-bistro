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
const app = express(),
    SPREADSHEET_ID = process.env.SPREADSHEET_ID,
    INTEGRATION_ID = process.env.INTEGRATION_ID,
    API_URL = process.env.API_URL,
    API_TOKEN = process.env.API_TOKEN;

// Initialize Sequelize
const sequelize = new Sequelize('verLaCarta', 'postgres', process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
});

// Test the connection
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
    // Let's finish the program: // TODO: Remove this, maybe retry.
    process.exit(1);
}

const models = initModels(sequelize);
sequelize.sync();

const getOneRestaurant = async (id) => {
    try {
        const restaurant = await models.Restaurant.findByPk(id);
        console.log(restaurant.toJSON());
        return restaurant;
    } catch (error) {
        console.error('Error fetching restaurant:', error);
    }
};

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


const BASE_URL = `${API_URL}${INTEGRATION_ID}/${SPREADSHEET_ID}`;
const RESTAURANTE_SHEET_NAME = 'Restaurante';
const MENU_SHEET_NAME = 'Menu';
const COMANDA_SHEET_NAME = 'Comanda';
const ESTADO_SHEET_NAME = 'Estado';

const ALL_SHEET_NAMES = [RESTAURANTE_SHEET_NAME, MENU_SHEET_NAME, COMANDA_SHEET_NAME, ESTADO_SHEET_NAME];

async function fetchSheetData(sheetName) {
    try {
        const response = await fetch(`${BASE_URL}/values/${sheetName}`);
        console.log(`${BASE_URL}/values/${sheetName}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${sheetName} sheet:`, error);
        throw error;
    }
}

// Definición de la función para actualizar la hoja de cálculo
async function updateSheetData(sheetName, values) {
    const processedValues = values.map(row => row.map(cell => String(cell)));

    const response = await fetch(`${BASE_URL}/values/${sheetName}!A1:Z100?valueInputOption=RAW`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
            values: processedValues,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text(); // Obtener detalles del error
        console.error('Error response:', response.status, response.statusText);
        console.error('Error details:', errorText);
        throw new Error(`Error al actualizar los datos en la hoja de cálculo: ${response.statusText}`);
    }
}

// Definición de la función para añadir datos a la hoja de cálculo
async function appendSheetData(sheetName, values) {
    const processedValues = values.map(row => row.map(cell => String(cell)));

    const response = await fetch(`${BASE_URL}/values/${sheetName}!A1:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
            values: processedValues,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text(); // Obtener detalles del error
        console.error('Error response:', response.status, response.statusText);
        console.error('Error details:', errorText);
        throw new Error(`Error al añadir los datos en la hoja de cálculo: ${response.statusText}`);
    }

    return await response.json(); // Devuelve la respuesta en caso de éxito
}

// // Function to check if the data has changed.
// async function pollForChanges() {
//     for (const sheetName of ALL_SHEET_NAMES) {
//         try {
//             const cacheKey = `sheet_${sheetName}`;
//             const cachedData = cache.get(cacheKey);
//             const currentData = await fetchSheetData(sheetName);
//
//             if (JSON.stringify(currentData) !== JSON.stringify(cachedData)) {
//                 // Remove these logs if you feel like it.
//                 // console.log(currentData);
//                 // console.log('vs');
//                 // console.log(cachedData);
//                 // console.log(`Data for ${sheetName} has changed, updating cache.`);
//                 cache.set(cacheKey, currentData);
//             } else {
//                 console.log(`No changes in data for ${sheetName}.`);
//             }
//         } catch (error) {
//             console.error(`Error polling ${sheetName}:`, error);
//         }
//     }
// }

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

async function fetchSheetDataWithCache(sheetName) {
    const cacheKey = `sheet_${sheetName}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        console.log(`Returning cached data for ${sheetName}`);
        return cachedData;
    }

    try {
        const data = await fetchSheetData(sheetName);
        cache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${sheetName} sheet:`, error);
        throw error;
    }
}

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


app.get('/Estado', async (req, res) => {
    try {
        const data = await fetchSheetDataWithCache(ESTADO_SHEET_NAME);
        res.send(convertToJSON(data.values));
    } catch (error) {
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

app.post('/comanda/estado', async (req, res) => {
    const { orderId, newStatusId } = req.body;

    try {
        const order = await models.Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const newStatus = await models.OrderStatus.findByPk(newStatusId);
        if (!newStatus) {
            return res.status(404).json({ error: 'Invalid status' });
        }

        order.status_id = newStatusId;
        await order.save();

        // Optionally, you can add a new entry to OrderStatusHistory here if you decide to implement it later

        res.status(200).json({ message: 'Order status updated successfully' });

        // Emit a socket event to notify clients about the status change
        io.emit('orderStatusUpdated', { orderId, newStatus: newStatus.status_name });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'An error occurred while updating the order status' });
    }
});

app.post('/crear-restaurante', async (req, res) => {
    const { nombre, latitud, longitud, descripcion, platos } = req.body;

    // Obtén los datos actuales de la hoja de cálculo
    const data = await fetchSheetDataWithCache(RESTAURANTE_SHEET_NAME);
        
    // Encuentra el máximo ID existente
    const existingIds = data.values.map(row => row[0]); // Asumiendo que el ID está en la primera columna
    const maxId = Math.max(...existingIds.filter(id => !isNaN(id)).map(Number)); // Filtrar y convertir a números
    const newId = maxId + 1; // Generar nuevo ID

    // Formato del objeto final
    const restaurantData = {
        id: newId,
        nombre,
        lat: latitud,
        len: longitud,
        descripcion,
        platos
    };

    // Obtén los datos actuales de la hoja de cálculo para los platos
    const menuData = await fetchSheetDataWithCache(MENU_SHEET_NAME);
    
    // Encuentra el máximo ID existente para los platos
    const existingPlateIds = menuData.values.map(row => row[0]); // Asumiendo que el ID de plato está en la primera columna
    const maxPlateId = Math.max(...existingPlateIds.filter(id => !isNaN(id)).map(Number)); // Filtrar y convertir a números

    try {
        // Formatear los datos para agregar a la hoja de cálculo
        const formattedRestaurantData = [
            restaurantData.id,
            restaurantData.nombre,
            restaurantData.lat,
            restaurantData.len,
            restaurantData.descripcion,
        ];

        // Llamar a la función que actualiza los datos en la hoja de cálculo
        await appendSheetData(RESTAURANTE_SHEET_NAME, [formattedRestaurantData]);

        const formattedPlatosData = platos.map((plato, index) => [
            maxPlateId + index + 1,
            restaurantData.id,
            plato.nombre,
            plato.precio,
            plato.descripcion
        ]);

        // Llamar a la función que actualiza los datos en la hoja de cálculo del Menu
        await appendSheetData(MENU_SHEET_NAME, formattedPlatosData);

        // Enviar una respuesta exitosa
        res.status(200).json({ message: 'Restaurante con su menu creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el restaurante:', error);
        res.status(500).json({ error: 'Ocurrió un error al crear el restaurante' });
    }
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
                id: fullOrderItem.order_item_id,
                name: fullOrderItem.MenuItem.name,
                price: fullOrderItem.price,
                quantity: fullOrderItem.quantity,
                status: fullOrderItem.Order.OrderStatus.status_name,
                restaurantId: fullOrderItem.Order.Restaurant.restaurant_id,
                restaurantName: fullOrderItem.Order.Restaurant.restaurant_name
            };

            io.emit('cartUpdated', response);

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
