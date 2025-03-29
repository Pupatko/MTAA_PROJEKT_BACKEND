const pool = require('../config/db');

// get tests
const getTestBySubject = async (request, response) => {
  const { subject } = request.body;
  
  try {
    const result = await pool.query("SELECT * FROM tests WHERE subject = $1", [subject]);
    
    if (result.rowCount === 0) {
      return response.status(404).json({
        success: false,
        message: "No test for the subject"
      });
    } else {
      return response.status(200).json({
        success: true,
        message: "Tests found",
        data: result.rows
      });
    }
    
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};


// get questions by test
const getQuestionsByTestId = async (request, response) => {
  const { id } = request.body;
  
  try {
    const result = await pool.query("SELECT * FROM questions WHERE test_id = $1", [id]);
    
    if (result.rowCount === 0) {
      return response.status(404).json({
        success: false,
        message: "No questions in the test",
      });
    } else {
      return response.status(200).json({
        success: true,
        message: "Questions found in the test ^^",
        data: result.rows
      });
    }
    
  } catch (err) {
    console.log(err);
    return response.status(500).send("ERROR !");
  }
};


// get answers by question id
const getAnswersByQuestionId = async (request, response) => {
  const { id } = request.body;
  
  try {
    const result = await pool.query("SELECT * FROM answers WHERE question_id = $1", [id]);

    if (result.rowCount === 0) {
      return response.status(404).json({
        success: false,
        message: "No answers in the question",
      });
    } else {
      return response.status(200).json({
        success: true,
        message: "Answers found in the question ^^",
        data: result.rows
      });
    }
    
  } catch (err) {
    console.log(err);
    return response.status(500).send("ERROR !");
  }
};

module.exports = {
  getTestBySubject,
  getQuestionsByTestId,
  getAnswersByQuestionId
};
