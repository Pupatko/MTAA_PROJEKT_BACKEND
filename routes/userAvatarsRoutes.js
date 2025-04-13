const express = require('express');
const router = express.Router();
const userAvatarController = require('../controllers/userAvatarController');
const authenticate = require('../middlewares/authenticate');

// Avatar middleware in userAvatarController.js to handle uploaded files(multer)

/**
 * @swagger
 * tags:
 *   name: User Avatars
 *   description: Management of user profile images
 */

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     operationId: uploadAvatar
 *     summary: Upload user avatar
 *     tags: [User Avatars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar file (JPEG or PNG)
 *     responses:
 *       200:
 *         description: Avatar successfully uploaded
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
 *                   example: Avatar uploaded successfully
 *       400:
 *         description: Invalid file format or no file uploaded
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, userAvatarController.uploadAvatar);

/**
 * @swagger
 * /users/avatar:
 *   get:
 *     summary: Download your own avatar
 *     tags: [User Avatars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar file
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Avatar not found
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, userAvatarController.downloadAvatar);

/**
 * @swagger
 * /users/avatar/{userID}:
 *   get:
 *     summary: Download another user's avatar
 *     tags: [User Avatars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: User UUID
 *     responses:
 *       200:
 *         description: Avatar file
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Avatar not found
 *       500:
 *         description: Server error
 */
router.get('/:userID', authenticate, userAvatarController.downloadAvatar);

/**
 * @swagger
 * /users/avatar:
 *   delete:
 *     summary: Delete your own avatar
 *     tags: [User Avatars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar successfully deleted
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
 *                   example: Avatar deleted successfully
 *       404:
 *         description: Avatar not found
 *       500:
 *         description: Server error
 */
router.delete('/', authenticate, userAvatarController.deleteAvatar);

module.exports = router;