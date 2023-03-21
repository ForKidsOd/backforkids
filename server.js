// Подключение необходимых модулей:
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

const { DB_HOST, PORT = 5000 } = process.env;

// Создание экземпляра приложения Express:
const app = express();

// Подключение базы данных MongoDB:
mongoose.connect(DB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('MongoDB connection error:', error));

// Создание схемы и модели для товаров:
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  size: String,
  color: String,
  image: String,
});

const Product = mongoose.model('Product', productSchema);

// Реализация маршрутов для получения и создания товаров:
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send(product);
});

// Реализация маршрутов для работы с корзиной:
let cart = [];

app.get('/cart', (req, res) => {
  res.send(cart);
});

app.post('/cart', (req, res) => {
  const product = req.body;
  cart.push(product);
  res.send(cart);
});

app.delete('/cart/:id', (req, res) => {
  const id = req.params.id;
  cart = cart.filter(item => item._id !== id);
  res.send(cart);
});




// Запуск сервера:
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
