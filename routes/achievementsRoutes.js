const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Achievements
 *   description: Achievement management and tracking
 */

/**
 * @swagger
 * /achievements:
 *   get:
 *     summary: Get all achievements with unlock status for the logged-in user
 *     description: Returns all achievements with their unlock status and progress for the authenticated user. Also includes achievements grouped by condition type.
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all achievements with their unlock status and progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 achievements:
 *                   type: array
 *                 groupedAchievements:
 *                   type: object
 *                   description: Achievements grouped by condition_type
 *                   additionalProperties:
 *                     type: array
 *                      
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, achievementController.getAllAchievements);

/**
 * @swagger
 * /achievements/detail/{id}:
 *   get:
 *     summary: Get detailed info about specific achievement
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Achievement details including progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 achievement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1"
 *                     title:
 *                       type: string
 *                       example: "Chatty Beginner"
 *                     description:
 *                       type: string
 *                       example: "Send 10 messages"
 *                     condition_type:
 *                       type: string
 *                       example: "message_sent"
 *                     condition_value:
 *                       type: integer
 *                       example: 10
 *                     icon_path:
 *                       type: string
 *                       example: "/images/achievements/message_sent_1.png"
 *                     unlocked:
 *                       type: boolean
 *                       example: false
 *                     achieved_at:
 *                       type: string
 *                       format: date-time
 *                       example: null
 *                     current_value:
 *                       type: integer
 *                       example: 7
 *                     last_updated:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-10T12:34:56.789Z"
 *                     progress_percent:
 *                       type: integer
 *                       example: 70
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Achievement not found
 *       500:
 *         description: Server error
 */
router.get('/detail/:id', authenticate, achievementController.getAchievement);

/**
 * @swagger
 * /achievements/user/{userID}:
 *   get:
 *     summary: Get achievements for a specific user(unlocked only), not only yourself
 *     description: Returns only unlocked achievements for a specific user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: User achievements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       condition_type:
 *                         type: string
 *                       condition_value:
 *                         type: integer
 *                       icon_path:
 *                         type: string
 *                       achieved_at:
 *                         type: string
 *                         format: date-time
 *                 progress:
 *                   type: object
 *                   description: Progress data for each condition type
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       condition_type:
 *                         type: string
 *                       current_value:
 *                         type: integer
 *                       last_updated:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:userID', authenticate, achievementController.getUserAchievements);

module.exports = router;