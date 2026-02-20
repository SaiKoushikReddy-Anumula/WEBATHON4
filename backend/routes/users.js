const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, userController.getProfile);
router.get('/profile/:id', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.get('/search', protect, userController.searchUsers);

module.exports = router;
