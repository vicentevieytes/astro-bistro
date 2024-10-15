import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { convertToJSON } from '../frontend-consumidor/src/utils/auxiliary.js';
import NodeCache from 'node-cache';

dotenv.config();

// Initialize express app
const app = express(),
    SPREADSHEET_ID = process.env.SPREADSHEET_ID,
    INTEGRATION_ID = process.env.INTEGRATION_ID,
    API_URL = process.env.API_URL;

// Initialize cache with no TTL because the pollig mechanism will do it for us.
const cache = new NodeCache();

app.use(
    cors({
        origin: ['http://localhost:4321', 'http://localhost:4322'],
    }),
);

app.use(bodyParser.json());

const BASE_URL = `${API_URL}${INTEGRATION_ID}/${SPREADSHEET_ID}`;
const RESTAURANTE_SHEET_NAME = 'Restaurante';
const MENU_SHEET_NAME = 'Menu';
const COMANDA_SHEET_NAME = 'Comanda';
const ESTADO_SHEET_NAME = 'Estado';

const ALL_SHEET_NAMES = [RESTAURANTE_SHEET_NAME, MENU_SHEET_NAME, COMANDA_SHEET_NAME, ESTADO_SHEET_NAME];

async function fetchSheetData(sheetName) {
    try {
        const response = await fetch(`${BASE_URL}/values/${sheetName}`);
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
    console.log('Aca está el error');

    const response = await fetch(`${BASE_URL}/values/${sheetName}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // range: sheetName,
            values: values,
        }),
    });

    // console.log(response)

    if (!response.ok) {
        throw new Error('Error al actualizar los datos en la hoja de cálculo');
    }
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
                console.log(currentData);
                console.log('vs');
                console.log(cachedData);
                console.log(`Data for ${sheetName} has changed, updating cache.`);
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
setInterval(pollForChanges, 60000);

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // We poll at the very beginning to populate the cache
    pollForChanges();
});
