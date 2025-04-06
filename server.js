const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser');

const cors = require('cors')
// TODO 
// const http = require('http')
// const WebSocket = require('ws').Server

// Route configuration
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Middleware CookieParser
app.use(cookieParser());

// TODO
// Add logging middleware ??? 

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API FOR THE APP' })
})

// Connect routes to main file
app.use('/users', userRoutes);
app.use('/tests', testRoutes);
app.use('/chats', chatRoutes);
app.use('/groups', groupRoutes);
app.use('/auth', authRoutes);

// Unknown route
app.use((req, res, next) => {
  res.status(404).json({
      success: false,
      message: 'Route not found'
  });
});

// Error handling middleware, catches errors passed to next(err), example: return next(error);
app.use((err, req, res, next) => {
  console.error(err.message); // Logging occured error 
  const statusCode = err.statusCode || 500; // Set status code
  
  res.status(statusCode).json({ // Send response
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message
  });
});

app.listen(port, () => {
  console.log('App running on port ' , port);
})