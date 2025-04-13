const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const cors = require('cors')

// For swagger documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Crete http server for socket.io
const http = require('http')
const server = http.createServer(app); 

// Initialize Socket.io
const WebSocket = require('ws');
const { initializeChatSocket } = require('./sockets/chatSocket');
const { initializeNotificationSocket } = require('./sockets/notificationSocket');

const wss = new WebSocket.Server({ server });
initializeChatSocket(wss);
initializeNotificationSocket(wss);

// Route configuration
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const chatRoutes = require('./routes/chatRoutes');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authRoutes');
const achievementRoutes = require('./routes/achievementsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userAvatarsRoutes = require('./routes/userAvatarsRoutes');

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Middleware CookieParser
app.use(cookieParser());

// enabling the Helmet middleware
app.use(helmet());

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API FOR THE APP' })
})

// Connect routes to main file
app.use('/users', userRoutes);
app.use('/tests', testRoutes);
app.use('/chats', chatRoutes);
app.use('/groups', groupRoutes);
app.use('/auth', authRoutes);
app.use('/achievements', achievementRoutes);
app.use('/notifications', notificationRoutes);
app.use('/users/avatar', userAvatarsRoutes);

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

// Use server.listen instead of app.listen for using socket.io
server.listen(port, () => {
  console.log('App running on port ' , port);
  console.log('Socket.io server running on port ', port);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
})