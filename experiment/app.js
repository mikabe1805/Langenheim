// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, User } = require('./db');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the registration form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/registration.html');
});

// Handle registration form submission
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.send('User already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.send('Registration successful!');

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
