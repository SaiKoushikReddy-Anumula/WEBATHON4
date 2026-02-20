const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, interviewController.createInterviewChat);
router.get('/', protect, interviewController.getInterviewChats);
router.get('/:id', protect, interviewController.getInterviewChat);

module.exports = router;
