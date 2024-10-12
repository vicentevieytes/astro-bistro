import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Initialize express app
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(
    cors({
        origin: 'http://localhost:4321', // Replace with your frontend's origin
    }),
);

// Use JSON body parser
app.use(bodyParser.json());

// Basic route for testing
app.get('/api', (req, res) => {
    res.send({
        WorkingStatus: 'API is working',
    });
});

// Set up port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
