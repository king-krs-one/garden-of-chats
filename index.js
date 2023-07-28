const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

const users = [];

app.use(cors());
app.use(bodyParser.json());

// Register endpoint
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username is already taken
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    // Create a new user object
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Save the user
    users.push(newUser);

    return res.status(201).json({ message: 'User created successfully' });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user with the given username
  const user = users.find((user) => user.username === username);

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If the password matches, create a JWT token
    const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });

    return res.json({ message: 'Login successful', token });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});