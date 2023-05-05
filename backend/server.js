
import express from 'express';
import products from "./products.js";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.get('/', (req, res) => {
    return res.send('API is running...');
});
app.get('/api/products', (req, res) => {
    return res.json(products).status(200);
});
app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    return res.json(product || []).status(product ? 200 : 404);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});
