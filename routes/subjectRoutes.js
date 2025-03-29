const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/testController');

router.get('/tests', subjectController.getTestBySubject);
router.get('/questions', subjectController.getQuestionsByTestId);
router.get('/answers', subjectController.getAnswersByQuestionId);

module.exports = router;