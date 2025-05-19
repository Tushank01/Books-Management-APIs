const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); // For creating JWT tokens
const User = require('../models/user'); // Sequelize model for the User
require('dotenv').config(); // Load environment variables from .env file

// Controller to handle user registration
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the user's password before storing it
    const hash = await bcrypt.hash(password, 10);

    // Create a new user in the database with hashed password
    const user = await User.create({ username, password: hash });

    // Return success response with created user ID
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    // Handle any error during user creation (e.g., duplicate username)
    res.status(400).json({ error: err.message });
  }
};

// Controller to handle user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username in the database
    const user = await User.findOne({ where: { username } });

    // If user doesn't exist, return error
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Compare the entered password with the stored hashed password
    const valid = await bcrypt.compare(password, user.password);

    // If password doesn't match, return error
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate a JWT token with user ID as payload, valid for 1 hour
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token to the client
    res.json({ token });
  } catch (err) {
    // Handle unexpected errors during login
    res.status(500).json({ error: err.message });
  }
};
