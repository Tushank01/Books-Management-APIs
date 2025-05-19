
const express = require('express');
require('dotenv').config();
const app = express();
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const sequelize = require('./config/db');

app.use(express.json());

app.use(authRoutes);
app.use(bookRoutes);
app.use(reviewRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('DB sync error:', err);
});

module.exports = app;
