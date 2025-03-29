const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const cors = require('cors')
// TODO 
// const http = require('http')
// const WebSocket = require('ws').Server

// Route configuration
const userRoutes = require('./routes/userRoutes');
const subjectRoutes = require('./routes/subjectRoutes');

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// TODO
// Add logging middleware
// Add Error handling middleware

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API FOR THE APP' })
})

// Connect routes to main file
app.use('/user', userRoutes) // Set user routes, /user/{}
app.use('/subjects', subjectRoutes)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})