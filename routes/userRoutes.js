const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.patch('/edit-name', userController.editName);
router.patch('/edit-password', userController.editPassword);
router.delete('/delete', userController.deleteUser);

module.exports = router;