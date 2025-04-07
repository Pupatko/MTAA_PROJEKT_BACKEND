const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

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
 *       500:
 *         description: Server error
 */
router.post('/register', userController.register);

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
 *     summary: Edit user's name
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - newName
 *             properties:
 *               id:
 *                 type: integer
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User name updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/edit-name', authenticate, userController.editName);

/**
 * @swagger
 * /users/edit-password:
 *   patch:
 *     summary: Edit user's password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - newPassword
 *             properties:
 *               id:
 *                 type: integer
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User password updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/edit-password', authenticate, userController.editPassword);

/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/delete', authenticate, userController.deleteUser);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/profile', authenticate, userController.profile);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User successfully logged out
 *       500:
 *         description: Server error
 */
router.post('/logout', authenticate, userController.logout);

module.exports = router;
