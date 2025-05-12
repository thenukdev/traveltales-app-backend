require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => console.error('Unable to connect to the database:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Travel App API' });
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const postLikeRoutes = require('./routes/postLike.routes');
const followRoutes = require('./routes/follow.routes');
const countryRoutes = require('./routes/country.routes');

app.use('/api', authRoutes); // Changed to match the new endpoint structure
app.use('/api', postRoutes); // Add post routes
app.use('/api', postLikeRoutes); // Add post like routes
app.use('/api', followRoutes); // Add follow routes
app.use('/api', countryRoutes); // Add country routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export app for testing purposes
module.exports = app;