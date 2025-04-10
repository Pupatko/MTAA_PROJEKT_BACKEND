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
 * /groups:
 *   post:
 *     summary: Create a new group
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
 *               - name
 *               - description
 *               - created_by
 *             properties:
 *               name:
 *                 type: string
 *                 example: Study Group
 *               description:
 *                 type: string
 *                 example: A group for studying together
 *               created_by:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user creating the group
 *                 example: 123e4567-e89b-12d3-a456-426614174001
 *     responses:
 *       201:
 *         description: Group created successfully
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
 *                   example: Group created succesfully
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
 *                       example: A group for studying together
 *                     created_by:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174001
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, groupController.create);

/**
 * @swagger
 * /groups:
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
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format
 *       404:
 *         description: No groups found
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, groupController.getAllGroups);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Get group by ID
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticate, groupController.getGroupById);

/**
 * @swagger
 * /groups/{id}/members:
 *   get:
 *     summary: Get all members of a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the group
 *     responses:
 *       200:
 *         description: List of group members
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
 *                   example: Members found in the group ^^
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
 *                       email:
 *                         type: string
 *                       group_id:
 *                         type: string
 *                         format: uuid
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format
 *       404:
 *         description: No members in the group
 *       500:
 *         description: Server error
 */
router.get('/:id/members', authenticate, groupController.getGroupMembers);

/**
 * @swagger
 * /groups/{id}:
 *   post:
 *     summary: Add member to a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the group
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
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174001
 *                     group_id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *       400:
 *         description: Bad request - missing required parameters
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format
 *       500:
 *         description: Server error
 */
router.post('/:id/member', authenticate, groupController.addMember);

/**
 * @swagger
 * /groups/edit-name:
 *   patch:
 *     summary: Edit group name (group owner only)
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
 *               - id
 *               - newName
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the group
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               newName:
 *                 type: string
 *                 description: New name for the group
 *                 example: Updated Study Group
 *     responses:
 *       200:
 *         description: Group name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     name:
 *                       type: string
 *                       example: Updated Study Group
 *                     description:
 *                       type: string
 *                     created_by:
 *                       type: string
 *                       format: uuid
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format/User is not the creator of the group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.patch('/edit-name', authenticate, isGroupCreator, groupController.editName);

/**
 * @swagger
 * /groups/edit-description:
 *   patch:
 *     summary: Edit group description (group owner only)
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
 *               - id
 *               - newDescription
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the group
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               newDescription:
 *                 type: string
 *                 description: New description for the group
 *                 example: Updated description for our study group
 *     responses:
 *       200:
 *         description: Group description updated successfully
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
 *                   example: Group description edited succesfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                       example: Updated description for our study group
 *                     created_by:
 *                       type: string
 *                       format: uuid
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format/User is not the creator of the group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.patch('/edit-description', authenticate, isGroupCreator, groupController.editDescription);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Delete group owner group by ID (group owner only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the group to delete
 *     responses:
 *       200:
 *         description: Group deleted successfully
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
 *                   example: Group deleted succesfully
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - Token expired or invalid format/User is not the creator of the group
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticate, isGroupCreator, groupController.deleteGroup);

/**
 * @swagger
 * /groups/{id}/member/{user_id}:
 *   delete:
 *     summary: Remove a member from group (group owner only)
 *     tags: [Groups]
 *     description: Removes a user from the group. This action can only be performed by the group creator.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the group
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the user to be removed
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
 *                   example: Member deleted from the group
 *       400:
 *         description: Bad request - missing required parameters
 *       401:
 *         description: Unauthorized - User not authenticated or invalid token
 *       403:
 *         description: Forbidden - User is not the creator of the group or token expired
 *       404:
 *         description: Member not found in the group
 *       500:
 *         description: Server error
 */
router.delete('/:id/member/:user_id', authenticate, isGroupCreator, groupController.removeMember);

module.exports = router;