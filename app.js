// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB connection string)
mongoose.connect('mongodb://mongo:27017/ashudb', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a simple User model
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the login page!');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ username, password });

  if (user) {
    // Store the user in the session
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid username or password.');
  }
});

app.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (req.session.user) {
    res.send(`Welcome, ${req.session.user.username}! This is your dashboard.`);
  } else {
    res.redirect('/login');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
