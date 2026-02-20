const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, workspaceController.getWorkspace);
router.post('/:id/tasks', protect, workspaceController.addTask);
router.put('/:id/tasks/:taskId', protect, workspaceController.updateTask);
router.post('/:id/messages', protect, workspaceController.addMessage);

module.exports = router;
