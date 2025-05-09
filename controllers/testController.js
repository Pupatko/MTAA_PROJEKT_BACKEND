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
      return response.status(200).json({
        success: false,
        message: "No questions in the test",
        data: []
      });
    } else {
      return response.status(200).json({
        success: true,
        message: "Questions found in the test",
        data: result.rows
      });
    }
    
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

// get answers by question id
const getAnswersByQuestionId = async (request, response) => {
  const { id } = request.body;
  
  try {
    const result = await pool.query("SELECT * FROM answers WHERE question_id = $1", [id]);

    if (result.rowCount === 0) {
      return response.status(200).json({
        success: false,
        message: "No answers in the question",
        data: []
      });
    } else {
      return response.status(200).json({
        success: true,
        message: "Answers found in the question",
        data: result.rows
      });
    }
    
  } catch (err) {
    console.log(err);
    return response.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};


// Input: { testId: "uuid", userAnswers: [{ questionId: "uuid", answerId: "uuid" }, ...] }
const checkUserAnswers = async (request, response) => {
  const userId = request.user.id;
  const { testId, userAnswers } = request.body;
  
  try {
    // Check necessary parameters in the request body
    if (!testId || !userAnswers || !Array.isArray(userAnswers)) {
      return response.status(400).json({
        success: false,
        message: 'Invalid request format.'
      });
    }

    // Check test existence
    const testCheck = await pool.query('SELECT * FROM tests WHERE id = $1', [testId]);
    if (testCheck.rowCount === 0) {
      return response.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    let totalQuestions = 0;
    let correctAnswers = 0;
    let incorrectQuestions = [];
    
    // For each user answer check correctness
    for (const answer of userAnswers) {
      const { questionId, answerId } = answer;
      if (!questionId || !answerId) { continue; }// skip invalid answers
      
      // Control, that the question belongs to the test
      const isQuestionExists = await pool.query(
        'SELECT * FROM questions WHERE id = $1 AND test_id = $2', 
        [questionId, testId]
      );
      
      if (isQuestionExists.rowCount === 0) {continue; } // question not found

      totalQuestions++; // increment question count
      
      // Check if the answer is correct
      const isCorrectAnswer = await pool.query(
        'SELECT * FROM answers WHERE id = $1 AND question_id = $2 AND is_correct = TRUE',
        [answerId, questionId]
      );
      
      if (isCorrectAnswer.rowCount > 0) {
        correctAnswers++;
      } else {
        // The answer is incorrect, get the correct answer
        const correctAnswer = await pool.query(
          'SELECT id, answer_text FROM answers WHERE question_id = $1 AND is_correct = TRUE',
          [questionId]
        );
        
        // Get the user's selected answer text
        const userAnswer = await pool.query(
          'SELECT answer_text FROM answers WHERE id = $1',
          [answerId]
        );
        
        incorrectQuestions.push({
          questionId,
          questionText: isQuestionExists.rows[0].question,
          userAnswerId: answerId,
          userAnswerText: userAnswer.rows[0]?.answer_text || 'Unknown',
          correctAnswerId: correctAnswer.rows[0]?.id,
          correctAnswerText: correctAnswer.rows[0]?.answer_text || 'Unknown'
        });
      }
    }
    
    // Calculate score
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Add XP for the user
    if (totalQuestions > 0) {
      let xpToAdd = 3;// Default XP for each test
      
      // 5 XP for correct answers
      xpToAdd += correctAnswers * 5;
      await pool.query('UPDATE users SET xp = xp + $1 WHERE id = $2', [xpToAdd, userId]);// Update user XP in the database
    }
    
    return response.status(200).json({
      success: true,
      message: 'Test evaluated successfully',
      data: {
        totalQuestions,
        correctAnswers,
        score,
        incorrectQuestions: incorrectQuestions.length > 0 ? incorrectQuestions : null
      }
    });
  } catch (err) {
    console.error('Error evaluating test:', err);
    return response.status(500).json({
      success: false,
      message: "Failed to evaluate test",
      error: err.message
    });
  }
};

const getAllSubjects = async (request, response) => {
  try {
    const result = await pool.query("SELECT DISTINCT subject FROM tests");
    return response.status(200).json({
      success: true,
      message: "Subjects found",
      data: result.rows
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send("ERROR !");
  }
};

const saveTestResults = async (request, response) => {
  const userId = request.user.id;
  const { testId, score, maxScore, timeSpent } = request.body;
  
  try {
    // Validate input
    if (!testId || score === undefined || maxScore === undefined || timeSpent === undefined) {
      return response.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    
    // Check if test exists
    const testCheck = await pool.query('SELECT * FROM tests WHERE id = $1', [testId]);
    if (testCheck.rowCount === 0) {
      return response.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }
    
    // Insert results into database
    const result = await pool.query(
      `INSERT INTO user_test_results 
       (user_id, test_id, score, max_score, time_spent) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, score, max_score, percentage, completed_at, time_spent`,
      [userId, testId, score, maxScore, timeSpent]
    );
    
    return response.status(200).json({
      success: true,
      message: "Test results saved successfully",
      data: result.rows[0]
    });
    
  } catch (err) {
    console.error('Error saving test results:', err);
    return response.status(500).json({
      success: false,
      message: "Failed to save test results",
      error: err.message
    });
  }
};

module.exports = {
  getTestBySubject,
  getQuestionsByTestId,
  getAnswersByQuestionId,
  checkUserAnswers,
  getAllSubjects,
  saveTestResults,
};
