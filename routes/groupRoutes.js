const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

router.post('/create', groupController.create);
router.delete('/delete', groupController.deleteGroup);
router.put('/edit-name', groupController.editName);
router.put('/edit-description', groupController.editDescription);

module.exports = router;