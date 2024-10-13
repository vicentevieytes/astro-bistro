import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { convertToJSON } from '../src/utils/auxiliary.js';

dotenv.config();

// Initialize express app
const app = express(),
    SPREADSHEET_ID = process.env.SPREADSHEET_ID,
    INTEGRATION_ID = process.env.INTEGRATION_ID,
    API_URL = process.env.API_URL;

// Use CORS middleware to allow cross-origin requests
app.use(
    cors({
        origin: 'http://localhost:4321', // Replace with your frontend's origin
    }),
);

// Use JSON body parser
app.use(bodyParser.json());

// Basic route for testing
app.get('/Restaurante', async (req, res) => {
    const response = await fetch(`${API_URL}${INTEGRATION_ID}/${SPREADSHEET_ID}/values/Restaurante`),
        data = await response.json();
    res.send(convertToJSON(data.values));
});

app.get('/local', async (req, res) => {
    const id = req.query.id,
        response = await fetch(`${API_URL}${INTEGRATION_ID}/${SPREADSHEET_ID}/values/Restaurante`),
        data = await response.json(),
        localData = data.values.filter((row) => row[0] === id || row[0] === 'id');

    res.send(convertToJSON(localData));
});

app.get('/menu', async (req, res) => {
    const id = req.query.id,
        response = await fetch(`${API_URL}${INTEGRATION_ID}/${SPREADSHEET_ID}/values/Menu`),
        data = await response.json(),
        localData = data.values.filter((row) => row[1] === id || row[0] === 'id');

    res.send(convertToJSON(localData));
});

// Set up port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
