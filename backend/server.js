
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.js";
connectDB();
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/orders.js";
import uploadRoutes from "./routes/upload.js";
import path from "path";
const port = process.env.PORT || 5000;
const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set __dirname to the current directory
const __dirname = path.resolve();
// Make the uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Cookie parser
app.use(cookieParser());

app.get('/api', (req, res) => {
    return res.status(200).json({
        message: 'Root API endpoint',
    });
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
});

if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // any route that is not an API route, serve the index.html file
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
