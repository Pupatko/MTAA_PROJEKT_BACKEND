const express = require('express');
const router = express.Router();
const userController = require('../controllers/chatController');

router.post('/messages', userController.addChatMessage);
router.get('/messages', userController.getMessagesByGroupId);

module.exports = router;