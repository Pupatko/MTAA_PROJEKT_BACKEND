const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend management
 */

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get list of friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       xp:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, friendController.getFriends);

/**
 * @swagger
 * /friends/{userId}:
 *   post:
 *     summary: Add user as a friend
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of user to add as friend
 *     responses:
 *       201:
 *         description: Friend successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Cannot add yourself as a friend
 *       404:
 *         description: User not found
 *       409:
 *         description: Friendship already exists
 *       500:
 *         description: Server error
 */
router.post('/:userId', authenticate, friendController.addFriend);

/**
 * @swagger
 * /friends/{userId}:
 *   delete:
 *     summary: Remove user from friends list
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of user to remove from friends
 *     responses:
 *       200:
 *         description: Friend successfully removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Friendship not found
 *       500:
 *         description: Server error
 */
router.delete('/:userId', authenticate, friendController.removeFriend);

/**
 * @swagger
 * /friends/search:
 *   get:
 *     summary: Search users by name
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name or part of the name to search
 *     responses:
 *       200:
 *         description: Users matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       xp:
 *                         type: integer
 *                       is_friend:
 *                         type: boolean
 *       400:
 *         description: Search name is required
 *       500:
 *         description: Server error
 */
router.get('/search', authenticate, friendController.searchUsers);

module.exports = router;