require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./conf/db');

const contactRouter = require('./routers/contactRouter');
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const qrReviewRoutes = require('./routers/qrReviewRoutes');
const productReviewRoutes = require('./routers/productReviewRoutes');
const productRouter = require("./routers/productRoutes");
const productDetailRoutes = require('./routers/productDetailRoutes');
const { seedSuperAdmin } = require('./controllers/authController');
const clientRoutes = require('./routers/clientRoutes');
const clientManagementRoutes = require('./routers/clientManagementRoutes');
const paymentRouter = require('./routers/paymentRouter');
const supportRouter = require('./routers/supportRouter');
const shiprocketRouter = require('./routers/shiprocketRouter');
const startCronJobs = require('./cronJobs');

const app = express();

connectDB().then(() => {
  seedSuperAdmin();
  startCronJobs();
});

// ── CORS — only allow requests from our own frontend ──
const allowedOrigins = [
  process.env.CLIENT_URL,               // e.g. https://sumathitrends.com  (set in .env)
  ...(process.env.NODE_ENV !== 'production'
    ? ['http://localhost:3000', 'http://localhost:5173']  // Vite / CRA dev servers
    : [])
].filter(Boolean); // drop undefined if CLIENT_URL is not set yet

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin header) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,  // needed for Authorization headers / cookies
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/users', userRouter);
app.use('/api/qr-reviews', qrReviewRoutes);
app.use('/api/product-reviews', productReviewRoutes);
app.use('/api/products', productRouter);
app.use('/api/product-details', productDetailRoutes);
app.use('/api/client-auth', clientRoutes);
app.use('/api/admin/clients', clientManagementRoutes);
app.use('/api/payment', paymentRouter);
app.use('/api/support', supportRouter);
app.use('/api/shiprocket', shiprocketRouter);

app.get('/', (req, res) => res.json({ message: 'Sumathi Trends API running.' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));