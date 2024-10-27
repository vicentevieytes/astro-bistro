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

// Function to check if the data has changed.
async function pollForChanges() {
    for (const sheetName of ALL_SHEET_NAMES) {
        try {
            const cacheKey = `sheet_${sheetName}`;
            const cachedData = cache.get(cacheKey);
            const currentData = await fetchSheetData(sheetName);

            if (JSON.stringify(currentData) !== JSON.stringify(cachedData)) {
                // Remove these logs if you feel like it.
                // console.log(currentData);
                // console.log('vs');
                // console.log(cachedData);
                // console.log(`Data for ${sheetName} has changed, updating cache.`);
                cache.set(cacheKey, currentData);
            } else {
                console.log(`No changes in data for ${sheetName}.`);
            }
        } catch (error) {
            console.error(`Error polling ${sheetName}:`, error);
        }
    }
}

// Set up polling to run every minute.
setInterval(pollForChanges, 600000);

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

app.get('/Restaurante', async (req, res) => {
    try {
        const data = await fetchSheetDataWithCache(RESTAURANTE_SHEET_NAME);
        res.send(convertToJSON(data.values));
    } catch (error) {
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

app.get('/local', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await fetchSheetDataWithCache(RESTAURANTE_SHEET_NAME);
        const localData = data.values.filter((row) => row[0] === id || row[0] === 'id');
        res.send(convertToJSON(localData));
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.get('/menu', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await fetchSheetDataWithCache(MENU_SHEET_NAME);
        const localData = data.values.filter((row) => row[1] === id || row[0] === 'id');
        res.send(convertToJSON(localData));
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.get('/comandas', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await fetchSheetDataWithCache(COMANDA_SHEET_NAME);
        const localData = data.values.filter((row) => row[0] === id || row[0] === 'id');
        res.send(convertToJSON(localData));
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

app.get('/estado', async (req, res) => {
    const id = req.query.id;
    try {
        const data = await fetchSheetDataWithCache(ESTADO_SHEET_NAME);
        const localData = data.values.filter((row) => row[0] === id || row[0] === 'id');
        res.send(convertToJSON(localData));
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

//---

app.post('/comanda/estado', async (req, res) => {
    const { id, productId, stateId } = req.body;

    try {
        // Obtener los datos actuales de la hoja de cálculo
        const data = await fetchSheetDataWithCache(COMANDA_SHEET_NAME);

        // Encontrar la fila que corresponde al ID de la comanda y al productId
        const index = data.values.findIndex((row) => row[0] == parseInt(id) && row[1] == parseInt(productId));

        if (index === -1) {
            return res.status(404).json({ error: 'Comanda o Producto no encontrado' });
        }

        // Actualizar el estado de la comanda en la fila correspondiente
        data.values[index][5] = stateId;

        // Llamar a la función que actualiza los datos en la hoja de cálculo
        await updateSheetData(COMANDA_SHEET_NAME, data.values);

        // Enviar una respuesta exitosa
        res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el estado:', error);
        res.status(500).json({ error: 'Ocurrió un error al actualizar el estado' });
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

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//
//     // We poll at the very beginning to populate the cache
//     pollForChanges();
// });

// Socket.io



io.on('connection', (socket) => {
    console.log('A user connected');

    // TODO: We also need to load the existing cart even if they closed the tab and reopened it, right?

    socket.on('addToCart', async (item) => {
        try {
            // First, make sure we have a valid OrderStatus for Pending orders
            const pendingStatus = await models.OrderStatus.findOne({ where: { status_name: 'Aguardando aceptación' } });

            if (!pendingStatus) {
                throw new Error('Pending OrderStatus not found');
            }

            let order = await models.Order.findOne({
                where: {
                    user_id: item.userId,
                    status_id: pendingStatus.status_id  // Use the actual status_id from the database
                }
            });

            if (!order) {
                order = await models.Order.create({
                    user_id: item.userId,
                    restaurant_id: item.restaurantId,
                    status_id: pendingStatus.status_id  // Use the actual status_id from the database
                });
            }

            const orderItem = await models.OrderItem.create({
                order_id: order.order_id,
                item_id: item.id,
                quantity: item.quantity,
                price: item.price
            });

            const fullOrderItem = await models.OrderItem.findOne({
                where: { order_item_id: orderItem.order_item_id },
                include: [models.MenuItem]
            });

            io.emit('cartUpdated', fullOrderItem);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            socket.emit('error', 'Failed to add item to cart');
        }
    });



    socket.on('updateOrderStatus', ({ orderId, newStatus }) => {
        // Update order status in your database
        // Then emit the update to all clients
        console.log('TODO: Update order status:', orderId, newStatus);
        io.emit('orderStatusUpdated', { orderId, newStatus });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected. Ideally this should happen only when the user closes the tab.');
    });
});


// Replace app.listen with httpServer.listen
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    pollForChanges();
});
