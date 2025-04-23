require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a simple schema and model
const requestSchema = new mongoose.Schema({
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Request = mongoose.model('Request', requestSchema);

// API Endpoint to get data
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await Request.find().sort({ timestamp: -1 }).limit(10);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API Endpoint to add data
app.post('/api/requests', async (req, res) => {
    try {
        const newRequest = new Request({
            message: req.body.message || 'Button was clicked!'
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});