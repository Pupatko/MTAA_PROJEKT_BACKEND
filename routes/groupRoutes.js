const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
// Add middleware for controling group permissions
const { isGroupCreator, isGroupMember } = require('../middlewares/groupPermission');
const authenticate = require('../middlewares/authenticate');

const { validateGroupCreation, validateChangeGroupName, validateChangeGroupDescription } = require('../middlewares/validation');

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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authenticate, validateGroupCreation, groupController.create);

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
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No groups found
 *       500:
 *         description: Server error
 */
router.get('/', authenticate, groupController.getAllGroups);

/**
 * @swagger
 * /groups/search:
 *   get:
 *     summary: Search groups by name
 *     tags: [Groups]
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
 *         description: Groups matching the search criteria
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
 *                       description:
 *                         type: string
 *                       xp:
 *                         type: integer
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       is_owner:
 *                         type: boolean
 *                       is_member:
 *                         type: boolean
 *       400:
 *         description: Search name is required
 *       500:
 *         description: Server error
 */
router.get('/search', authenticate, groupController.searchGroups);

/**
 * @swagger
 * /groups/current:
 *   get:
 *     summary: Get current user's group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current group found
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
 *                     description:
 *                       type: string
 *                     xp:
 *                       type: integer
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     created_by:
 *                       type: string
 *                       format: uuid
 *                     member_count:
 *                       type: integer
 *                     is_owner:
 *                       type: boolean
 *       404:
 *         description: User is not a member of any group or group not found
 *       500:
 *         description: Server error
 */
router.get('/current', authenticate, groupController.getCurrentUserGroup);


/**
 * @swagger
 * /groups/leave:
 *   post:
 *     summary: Leave the current group (only for group members)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully left the group
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
 *                   example: You have successfully left the group
 *       400:
 *         description: User is not a member of any group
 *       403:
 *         description: Only group members can leave the group
 *       500:
 *         description: Server error while leaving group
 */
router.post('/leave', authenticate, groupController.leaveGroup);

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
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: Group details
 *       401:
 *         description: Unauthorized
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
 *         required: true
 *         description: Group ID
 *     responses:
 *       200:
 *         description: List of group members
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No members found
 *       500:
 *         description: Server error
 */
router.get('/:id/members', authenticate, isGroupMember, groupController.getGroupMembers);

/**
 * @swagger
 * /groups/{id}/member:
 *   post:
 *     summary: Join a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     responses:
 *       201:
 *         description: Successfully joined the group
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.post('/:id/member', authenticate, groupController.addMember);

/**
 * @swagger
 * /groups/{id}/edit-name:
 *   patch:
 *     summary: Edit group name (owner only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
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
 *         description: Group name updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/edit-name', authenticate, isGroupCreator, validateChangeGroupName, groupController.editName);

/**
 * @swagger
 * /groups/{id}/edit-description:
 *   patch:
 *     summary: Edit group description (owner only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newDescription
 *             properties:
 *               newDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Group description updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Group not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/edit-description', authenticate, isGroupCreator, validateChangeGroupDescription, groupController.editDescription);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Delete group (owner only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
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
 *                   example: Group deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *     summary: Remove a member from group (owner only)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Group ID
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/member/:user_id', authenticate, isGroupCreator, groupController.removeMember);

module.exports = router;