const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API FOR THE APP' })
})


app.post('/registerUser', db.registerUser)
app.get('/loginUser', db.loginUser)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})