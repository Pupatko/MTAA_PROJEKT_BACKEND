const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const authenticate = require('../middlewares/authenticate');

router.get('/achievements', authenticate, achievementController.getAchievementsByUserId);
router.get('/achievements/:achievementId', authenticate, achievementController.getAchievementById);
