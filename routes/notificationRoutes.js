const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middlewares/authenticate');


router.get('/:userId', authenticate, notificationController.getUserNotifications);

router.put('/read/:id', authenticate, notificationController.markAsRead);

router.put('/read-all', authenticate, notificationController.markAllAsRead);

router.delete('/:id', authenticate, notificationController.deleteNotification);

module.exports = router;