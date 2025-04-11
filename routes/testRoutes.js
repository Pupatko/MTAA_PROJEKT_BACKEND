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
router.get('/test', authenticate, subjectController.getTestBySubject);

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
router.get('/questions', authenticate, subjectController.getQuestionsByTestId);

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
router.get('/answers', authenticate, subjectController.getAnswersByQuestionId);

module.exports = router;