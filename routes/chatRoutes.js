const express = require('express');
const router = express.Router();
const userController = require('../controllers/chatController');
const authenticate = require('../middlewares/authenticate');

router.post('/messages', authenticate, userController.addChatMessage);
router.get('/messages', authenticate, userController.getMessagesByGroupId);

module.exports = router;