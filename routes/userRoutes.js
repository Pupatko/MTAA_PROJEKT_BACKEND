const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

// middlewares used express-validator to validate user inputed data(name, password)
const { validateRegistration, validateChangeName, validateChangePassword } = require('../middlewares/validation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User successfully registered
 *                 data:
 *                   type: object
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */
router.post('/register', validateRegistration, userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in, access token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User successfully logged in
 *                 data:
 *                   type: object
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Failed login
 *       404:
 *         description: User does not exist
 *       500:
 *         description: Server error
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /users/edit-name:
 *   patch:
 *     summary: Edit authenticated user's name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newName
 *             properties:
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User name updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: This name is already taken
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/edit-name', authenticate, validateChangeName, userController.editName);

/**
 * @swagger
 * /users/edit-password:
 *   patch:
 *     summary: Edit authenticated user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User password updated successfully
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/edit-password', authenticate, validateChangePassword, userController.editPassword);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/', authenticate, userController.deleteUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User found, profile shared
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     xp:
 *                       type: integer
 *                     group_id:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                     name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                 stats:
 *                   type: object
 *                   properties:
 *                     message_count:
 *                       type: integer
 *                     achievements_count:
 *                       type: integer
 *                 achievements:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error to get user profile
 */
router.get('/profile', authenticate, userController.profile);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User successfully logged out
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Server error
 */
router.post('/logout', authenticate, userController.logout);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get basic information about authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Basic user information retrieved
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     group_id:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/me', authenticate, userController.getBasicInfo);

module.exports = router;