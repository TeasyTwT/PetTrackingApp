'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const app = express();
const PORT = process.env.PORT || 3000;
const multer  = require('multer');
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Basic route for testing
const reqCount = {
  GET: 0,
  POST: 0,
  PUT: 0,
  PATCH: 0,
  DELETE: 0,
};

app.use((req, res, next) => {
  const method = req.method.toUpperCase();
  if (reqCount.hasOwnProperty(method)) {
    reqCount[method] += 1;
  }
  console.log("There has been", reqCount, "request(s)");
  next();
});

// Import routes
const routes = require('./src/routes/index'); // Update path to match new structure

// Use routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection and server start

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    console.log('Connection info:', {
        name: sequelize.config.database,
        host: sequelize.config.host,
        port: sequelize.config.port,
        dialect: sequelize.config.dialect
    });
    // Sync models with database (only in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;