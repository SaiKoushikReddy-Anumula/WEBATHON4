const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.post('/', protect, projectController.createProject);
router.get('/', protect, projectController.getProjects);
router.get('/recommendations', protect, projectController.getRecommendations);
router.get('/:id', protect, projectController.getProject);
router.put('/:id', protect, projectController.updateProject);
router.delete('/:id', protect, projectController.deleteProject);
router.post('/:id/apply', protect, projectController.applyToProject);
router.post('/applications/handle', protect, projectController.handleApplication);
router.post('/:id/remove-member', protect, projectController.removeMember);
router.get('/:id/suggestions', protect, projectController.getMatchingSuggestions);
router.post('/:id/invite', protect, projectController.sendInvitation);
router.post('/invitations/respond', protect, projectController.respondToInvitation);
router.post('/:id/rate-members', protect, projectController.rateMembers);

module.exports = router;
