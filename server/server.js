require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./conf/db');

const contactRouter = require('./routers/contactRouter');
const authRouter    = require('./routers/authRouter');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ── Routes
app.use('/api/auth',    authRouter);
app.use('/api/contact', contactRouter);

app.get('/', (req, res) => res.json({ message: 'Sumathi Trends API running.' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));