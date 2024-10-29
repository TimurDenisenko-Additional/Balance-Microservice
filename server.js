const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 150 },
  ]);
});

app.post('/products', (req, res) => {
  const newProduct = req.body;
  res.status(201).json({ message: 'Продукт добавлен', product: newProduct });
});

app.listen(PORT, () => {
  console.log(`Microservice is running on port ${PORT}`);
});