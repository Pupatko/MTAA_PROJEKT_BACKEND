const express = require('express');
const router = express.Router();
const userController = require('../controllers/chatController');

router.post('/newMessage', userController.addChatMessage);
router.post('/get', userController.getMessagesByGroupId);

module.exports = router;