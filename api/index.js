const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('../backend/db');
const routes = require('../backend/routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
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

// Sync database on cold start
if (!global.dbSynced) {
  sequelize.sync().then(() => {
    console.log('Database synchronized');
    global.dbSynced = true;
  }).catch((err) => {
    console.error('Error syncing database:', err);
  });
}

module.exports = app;
