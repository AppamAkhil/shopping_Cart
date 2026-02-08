const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, User, Item, Cart, CartItem, Order, OrderItem } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
sequelize.sync().then(() => {
  console.log('Database connected and models synchronized');
  
  app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}).catch((err) => {
  console.error('Error connecting to database:', err);
  process.exit(1);
});

module.exports = app;
