const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const port = 5000;


// MongoDB connection URI - Replace 'your-mongodb-uri' with your actual MongoDB URI
const mongoURI = 'mongodb://localhost:27017/userlogin';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


// Create a schema for the user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  profileImage: { type: String },
  online: { type: Boolean, default: false },
});

const chatMessageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  text: { type: String, required: true },
});

// Create models based on the schemas
const User = mongoose.model('User', userSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// app.use(cors());
// app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { username, password, email, profileImage } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, firstName, lastName, profileImage });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Set the online status to true for the logged-in user
    await User.updateOne({ _id: user._id }, { $set: { online: true } });

    // Generate a JSON Web Token for authentication
    const token = jwt.sign({ username: user.username }, 'your-secret-key', {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/logout', async (req, res) => {
  // Extract the user's username from the request (You'll need to implement authentication middleware for this)
  const { username } = req.user;

  try {
    // Set the online status to false for the logged-out user
    await User.updateOne({ username }, { $set: { online: false } });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging out' });
  }
});

app.post('/send-message', async (req, res) => {
  // Extract the user's username from the request (You'll need to implement authentication middleware for this)
  const { username } = req.user;
  const { text } = req.body;

  try {
    // Find the user who sent the message
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new chat message
    const chatMessage = new ChatMessage({ user: user._id, text });
    await chatMessage.save();

    // Add the chat message to the user's chatMessages array
    user.chatMessages.push(chatMessage._id);
    await user.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
