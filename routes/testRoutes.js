const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/testController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Endpoints for fetching tests, questions, and answers
 */

/**
 * @swagger
 * /tests/test:
 *   get:
 *     summary: Get tests by subject
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *             properties:
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tests found for the subject
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: No test for the subject
 *       500:
 *         description: Server error
 */
router.post('/test', authenticate, subjectController.getTestBySubject);

/**
 * @swagger
 * /tests/questions:
 *   get:
 *     summary: Get questions by test ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Questions found for the test
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: No questions in the test
 *       500:
 *         description: Server error
 */
router.post('/questions', authenticate, subjectController.getQuestionsByTestId);

/**
 * @swagger
 * /tests/answers:
 *   get:
 *     summary: Get answers by question ID
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Answers found for the question
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Invalid or expired token
 *       404:
 *         description: No answers in the question
 *       500:
 *         description: Server error
 */
router.post('/answers', authenticate, subjectController.getAnswersByQuestionId);

/**
 * @swagger
 * /tests/answers:
 *   post:
 *     summary: Submit test answers and get results
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testId
 *               - userAnswers
 *             properties:
 *               testId:
 *                 type: string
 *                 format: uuid
 *               userAnswers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       format: uuid
 *                     answerId:
 *                       type: string
 *                       format: uuid
 *     responses:
 *       200:
 *         description: Test evaluated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalQuestions:
 *                       type: integer
 *                     correctAnswers:
 *                       type: integer
 *                     score:
 *                       type: integer
 *                     incorrectQuestions:
 *                       type: array
 *       400:
 *         description: Invalid request format
 *       404:
 *         description: Test not found
 *       500:
 *         description: Server error
 */
router.post('/check-answers', authenticate, subjectController.checkUserAnswers);

router.get('/subjects', authenticate, subjectController.getAllSubjects);

router.post('/results', authenticate, subjectController.saveTestResults);

module.exports = router;