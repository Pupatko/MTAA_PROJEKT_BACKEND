const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');
// Add middleware for controling group permissions
const { isGroupCreator } = require('../middlewares/groupPermission');

router.post('/create', groupController.create);

router.patch('/edit-name', isGroupCreator, groupController.editName);
router.patch('/edit-description', isGroupCreator, groupController.editDescription);
router.delete('/delete', isGroupCreator, groupController.deleteGroup);

module.exports = router;