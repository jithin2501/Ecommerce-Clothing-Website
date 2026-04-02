require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connectDB = require('./conf/db');

const contactRouter  = require('./routers/contactRouter');
const authRouter     = require('./routers/authRouter');
const userRouter     = require('./routers/userRouter');
const reviewRoutes = require('./routers/reviewRoutes');
const productRouter   = require("./routers/productRoutes");
const productDetailRoutes = require('./routers/productDetailRoutes');
const { seedSuperAdmin } = require('./controllers/authController');
const clientRoutes           = require('./routers/clientRoutes');
const clientManagementRoutes = require('./routers/clientManagementRoutes');
const paymentRouter          = require('./routers/paymentRouter');

const app = express();

connectDB().then(() => {
  // Seed superadmin after DB connects
  seedSuperAdmin();
});

app.use(cors());
app.use(express.json());

app.use('/api/auth',    authRouter);
app.use('/api/contact', contactRouter);
app.use('/api/users',   userRouter);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRouter);
app.use('/api/product-details', productDetailRoutes);
app.use('/api/client-auth',    clientRoutes);           
app.use('/api/admin/clients',  clientManagementRoutes);
app.use('/api/payment',        paymentRouter);

app.get('/', (req, res) => res.json({ message: 'Sumathi Trends API running.' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));