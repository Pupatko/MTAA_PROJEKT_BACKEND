const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
// Add middleware for controling group permissions
const { isGroupCreator } = require('../middlewares/groupPermission');


// ADD REMOVE USER FROM GROUP
// ADD JOIN GROUP

/**
 * @swagger
 * tags:
 *   name: Groups
 *   description: Endpoints for managing user groups
 */

/**
 * @swagger
 * /groups/create:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - created_by
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               created_by:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Group created successfully
 *       500:
 *         description: Server error
 */
router.post('/create', groupController.create);

/**
 * @swagger
 * /groups/edit-name:
 *   patch:
 *     summary: Edit group name (admin only)
 *     tags: [Groups]
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
 *         description: Group name updated
 *       500:
 *         description: Server error
 */
router.patch('/edit-name', isGroupCreator, groupController.editName);

/**
 * @swagger
 * /groups/edit-description:
 *   patch:
 *     summary: Edit group description (admin only)
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - newDescription
 *             properties:
 *               id:
 *                 type: integer
 *               newDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group description updated
 *       500:
 *         description: Server error
 */
router.patch('/edit-description', isGroupCreator, groupController.editDescription);

/**
 * @swagger
 * /groups/delete:
 *   delete:
 *     summary: Delete a group by ID
 *     tags: [Groups]
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
 *         description: Group deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/delete', isGroupCreator, groupController.deleteGroup);

module.exports = router;