require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./conf/db');

const contactRouter = require('./routers/contactRouter');

const app = express();

// ── Connect to MongoDB
connectDB();

// ── Middleware
app.use(cors());
app.use(express.json());

// ── Routes
app.use('/api/contact', contactRouter);

// ── Health check
app.get('/', (req, res) => res.json({ message: 'Sumathi Trends API is running.' }));

// ── Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));