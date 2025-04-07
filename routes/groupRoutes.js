const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
// Add middleware for controling group permissions
const { isGroupCreator } = require('../middlewares/groupPermission');
const authenticate = require('../middlewares/authenticate');


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
router.post('/create', authenticate, groupController.create);


/**
 * @swagger
 * /groups/get-all:
 *   get:
 *     summary: Get all groups
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all groups
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
 *                   example: Groups found
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 123e4567-e89b-12d3-a456-426614174000
 *                       name:
 *                         type: string
 *                         example: Study Group
 *                       description:
 *                         type: string
 *                         example: Group for studying together
 *                       created_by:
 *                         type: string
 *                         format: uuid
 *                         example: 123e4567-e89b-12d3-a456-426614174001
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No groups found
 *       500:
 *         description: Server error
 */
router.get('/get-all', authenticate, groupController.getAllGroups);

/**
 * @swagger
 * /groups/user/{userID}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the group to retrieve
 *     responses:
 *       200:
 *         description: Group details
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
 *                   example: Group found
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     name:
 *                       type: string
 *                       example: Study Group
 *                     description:
 *                       type: string
 *                       example: Group for studying together
 *                     created_by:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174001
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.get('/user/:userID', authenticate, groupController.getGroupById);

/**
 * @swagger
 * /groups/add-member:
 *   post:
 *     summary: Add member to a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - user_id
 *             properties:
 *               group_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the group
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user to add
 *                 example: 123e4567-e89b-12d3-a456-426614174001
 *     responses:
 *       201:
 *         description: Member successfully added to the group
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
 *                   example: Member added to the group
 *                 data:
 *                   type: object
 *                   properties:
 *                     group_id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174001
 *       400:
 *         description: Bad request - missing required parameters
 *       500:
 *         description: Server error
 */
router.post('/add-member', authenticate, groupController.addMember);
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
router.patch('/edit-name', authenticate, isGroupCreator, groupController.editName);

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
router.patch('/edit-description', authenticate, isGroupCreator, groupController.editDescription);

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
router.delete('/delete', authenticate, isGroupCreator, groupController.deleteGroup);

/**
 * @swagger
 * /groups/remove-member:
 *   delete:
 *     summary: Remove a member from group
 *     tags: [Groups]
 *     description: Removes a user from the group. This action can only be performed by the group creator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - user_id
 *             properties:
 *               group_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the group
 *               user_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user to be removed
 *     responses:
 *       200:
 *         description: User successfully removed from the group
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
 *                   example: User successfully removed from the group
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Insufficient permissions to perform this action
 *       404:
 *         description: Group or user not found
 *       500:
 *         description: Server error
 */
router.delete('/remove-member', authenticate, isGroupCreator, groupController.removeMember);

module.exports = router;