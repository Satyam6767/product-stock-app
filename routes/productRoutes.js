
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.post('/generate', async (req, res) => {
  try {
    await Product.deleteMany(); // Optional: clean old data

    const products = [];

    for (let i = 1; i <= 50; i++) {
      const stock = Math.floor(Math.random() * 31) + 20; // Random between 20–50
      products.push({
        productName: `Item ${i}`,
        stockOnHand: stock,
      });
    }

    await Product.insertMany(products);
    res.status(201).json({ message: '50 products created successfully', products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate products' });
  }
});




router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});



router.get('/sort-name', async (req, res) => {
  try {
    const products = await Product.find().sort({ productName: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sort by name' });
  }
});






router.get('/sort-stock-desc', async (req, res) => {
  try {
    const products = await Product.find().sort({ stockOnHand: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to sort by stock' });
  }
});





router.put('/decrease-stock', async (req, res) => {
  try {
    const products = await Product.find();

    for (let product of products) {
      product.stockOnHand = Math.max(0, product.stockOnHand - 2);
      await product.save();
    }

    res.json({ message: 'Stock decreased by 2 for all products' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrease stock' });
  }
});




router.put('/increase-even-stock', async (req, res) => {
  try {
    const products = await Product.find();

    for (let product of products) {
      const numberMatch = product.productName.match(/(\d+)$/);
      if (numberMatch) {
        const number = parseInt(numberMatch[1]);
        if (number % 2 === 0) {
          product.stockOnHand += 2;
          await product.save();
        }
      }
    }

    res.json({ message: 'Increased stock by 2 for even-ending products' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update even stock' });
  }
});



module.exports = router;
