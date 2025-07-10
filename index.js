// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config(); // 👈 Load env variables

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use MongoDB URI from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// ✅ Use port from .env or default to 5000
const PORT = process.env.PORT || 5000;

app.use('/api/products', productRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
