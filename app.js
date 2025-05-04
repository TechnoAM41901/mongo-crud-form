const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User'); // Ensure you have the User model
const verifyToken = require('./middleware/verifyToken'); // Create this middleware file

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// MongoDB connection
require('./db')();  // Assuming you have the db.js file for MongoDB connection

// Routes
const userRoutes = require('./routes/userRoutes'); // Ensure this route file exists
const appointmentRoutes = require('./routes/appointmentRoutes'); // Ensure this route file exists
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// GET login page
app.get('/login', (req, res) => {
  res.render('login', { token: null, message: null });
});

// POST login (Authentication and Token Generation)
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { token: null, message: 'Invalid email' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { token: null, message: 'Invalid password' });
    }

    // Generate JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });

    // Set token as a cookie
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // Redirect to home page
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET register page
app.get('/register', (req, res) => {
  res.render('register', { message: null });
});

// POST register (User Registration)
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.render('register', { message: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Protected route example
app.get('/appointments', verifyToken, (req, res) => {
  // Assuming you have a function to get appointments for the logged-in user
  const userId = req.user.user.id;
  const appointments = getAppointmentsForUser(userId);
  res.render('appointments', { appointments });
});

// Route to handle home page or other pages
app.get('/', (req, res) => {
  const token = req.cookies.token || null; // Get the token from cookies if available
  res.render('index', { token });
});

// Error handling
app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
