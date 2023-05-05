
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
connectDB();
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/products.js";
const port = process.env.PORT || 5000;
const app = express();

app.get('/api', (req, res) => {
    return res.send('API is running...');
});

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
