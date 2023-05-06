
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from "./config/db.js";
connectDB();
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/user.js";
const port = process.env.PORT || 5000;
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
    return res.status(200).json({
        message: 'Root API endpoint',
    });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
