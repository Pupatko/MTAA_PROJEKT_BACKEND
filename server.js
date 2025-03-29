const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const up = require('./userProvider')
const sp = require('./subjectProvider')
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


// USER
app.post('/registerUser' , up.registerUser);
app.get('/loginUser' , up.loginUser);


// SUBJECT (test)
app.get('/getTests' , sp.getTestBySubject);
app.get('/getQuestions' , sp.getQuestionsByTestId);
app.get('/getAnswers' , sp.getAnswersByQuestionId);


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})