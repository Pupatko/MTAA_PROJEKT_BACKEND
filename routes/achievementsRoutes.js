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
 *     summary: Get all achievements with unlock status for logged-in user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of achievements with unlock status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 achievements:
 *                   type: array
 *                 groupedAchievements:
 *                   type: object
 *       401:
 *         description: Unauthorized
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
 *                 achievement:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     condition_type:
 *                       type: string
 *                     condition_value:
 *                       type: integer
 *                     icon_path:
 *                       type: string
 *                     unlocked:
 *                       type: boolean
 *                     achieved_at:
 *                       type: string
 *                     current_value:
 *                       type: integer
 *                     progress_percent:
 *                       type: integer
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
 *     summary: Get unlocked achievements for a specific user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User achievements retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                 achievements:
 *                   type: array
 *                 progress:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:userID', authenticate, achievementController.getUserAchievements);

module.exports = router;