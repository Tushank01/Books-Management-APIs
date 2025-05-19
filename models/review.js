const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Book = require('./book');

const Review = sequelize.define('Review', {
  rating: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT }
});

User.hasMany(Review);
Review.belongsTo(User);

Book.hasMany(Review);
Review.belongsTo(Book);

module.exports = Review;