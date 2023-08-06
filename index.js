
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./authMiddleware');


const express = require('express');
const http = require('http');
const cors = require('cors'); // Import the cors middleware
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
}); // Import Socket.IO and create an instance

// Apply CORS middleware to your entire app to allow all origins
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

let users = [];
let chatMessages = [];




// Create a new user object and add to the list/db
const addUser = (username, password, image, online) => {
  const newUser = {
    id: users.length,
    username,
    password,
    image: users.length === 0 ? "../../media/images/profiles/ava.png" : "../../media/images/profiles/una.png",
    online
  };

  users.push(newUser);
}

// Create a new message object and add to the list/db
const addMessage = (type, text, sender, receiver) => {
  console.log(type, text, sender, receiver)
  // type options are public and private 
  const chatMessage = {
    id: chatMessages.length,
    sender,
    type,
    receiver,
    text,
    timestamp: new Date(),
  };

  // This would normally be saved in the database
  chatMessages.push(chatMessage);
}


/******* REGISTER, LOGIN, LOGOUT, SEND ******************************************************** */

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

    // Add user
    addUser(username, hashedPassword, "", false)

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
    return res.json({ message: 'Login successful', user, token });
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

// Send Message from Chat
app.post('/api/send-message', verifyToken, (req, res) => {
  // console.log(req.user)
  const { text, type, receiver } = req.body;
  const user = users.find((u) => u.id === req.user.id);
  
  if (!user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid message' });
  }

  addMessage(type, text, user.id, receiver)
  return res.status(200).json({ message: 'Message sent successfully' });
});


// Validate Token Endpoint
app.post('/validateToken', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, "garden-of-chats-secret-key");
    console.log(decoded)
    // The token is valid, send the user details (or any other relevant data) back to the client
    const user = users[decoded.id]

    return res.json({ user });
  } catch (err) {
    // If the token is invalid or has expired, send an error response
    return res.status(401).json({ message: 'Invalid token.' });
  }
});


/******* QUERIES *********************************************************/

// Endpoint to query all users
app.get('/api/users', (req, res) => {
  try {
    // Read sample data from sampleData.json
    // const data = fs.readFileSync(path.resolve(__dirname, './sampleData.json'));
    // const users = JSON.parse(data).users;

    // console.log(users)

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Endpoint to query all messages
app.get('/api/chat-messages', (req, res) => {
  try {
    let messages = chatMessages.map(msg => {
      return {...msg, user: {...users[msg.sender]}}
    })
    // console.log(messages)
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});


/******* WEBSOCKET *********************************************************/

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
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});