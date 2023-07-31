

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./authMiddleware');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http); // Import Socket.IO and create an instance

const port = 5000;

let users = [];
let chatMessages = [];

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
      id: users.length,
      username,
      password: hashedPassword,
      image: "",
      online: false
    };

    // Save the user
    users.push(newUser);

    return res.status(201).json({ message: 'User created successfully' });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user with the given username
  const user = users.find((user) => user.username === username);

  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  } else {
    user.online = true;
  }

  // Compare the provided password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If the password matches, create a JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, 'garden-of-chats-secret-key', { expiresIn: '1h' });

    return res.json({ message: 'Login successful', token });
  });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  const { username } = req.body;
  
  if (username) {
    userIndex = users.findIndex(user => user.username === username)
    if (users[userIndex]){
      users[userIndex].online = false
    }
  }

  // Clear the JWT token to log out the user
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logout successful' });
});

// Endpoint to query all users
app.get('/api/users', (req, res) => {
  try {
    // Read sample data from sampleData.json
    // const data = fs.readFileSync(path.resolve(__dirname, './sampleData.json'));
    // const users = JSON.parse(data).users;

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Endpoint to query all messages
app.get('/api/chat-messages', (req, res) => {
  try {
    let messages = chatMessages.map(msg => {
      return {...msg, user: {...users[msg.userId]}}
    })
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Send Message from Chat
app.post('/api/send-message', verifyToken, (req, res) => {
  // console.log(req.user)
  const { message } = req.body;
  const user = users.find((u) => u.id === req.user.id);
  
  if (!user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const chatMessage = {
    id: chatMessages.length,
    userId: user.id,
    message,
    timestamp: new Date(),
  };

  // This would be save normally in the database
  chatMessages.push(chatMessage);

  return res.status(200).json({ message: 'Message sent successfully' });
});

// WebSockets (Socket.IO) code
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    console.log("received message")
    // Broadcast the received message to all connected clients (except the sender)
    socket.broadcast.emit('chatMessage', data);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


// Start the server with WebSocket support
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });