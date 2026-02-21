const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { findMatchingCandidates, findTeamCombinations } = require('../utils/matching');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      host: req.user._id,
      members: [req.user._id]
    });
    
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { activeProjectCount: 1 },
      $push: { currentProjects: project._id }
    });
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { skills, role, category, status } = req.query;
    
    const query = { deletedAt: null };
    
    if (skills) {
      const skillArray = skills.split(',');
      query['requiredSkills.skill'] = { $in: skillArray };
    }
    
    if (role) {
      query['requiredRoles.role'] = role;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status && status !== '') {
      query.status = status;
    } else if (status === undefined) {
      query.status = 'Open';
    }
    
    console.log('getProjects query:', JSON.stringify(query));
    console.log('status param:', status);
    
    const projects = await Project.find(query)
      .populate('host', 'username profile.name')
      .populate('members', 'username profile.name')
      .sort('-createdAt');
    
    console.log(`Found ${projects.length} projects`);
    console.log('Projects by status:', projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {}));
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('host', 'username profile')
      .populate('members', 'username profile')
      .populate('applications.user', 'username profile');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const oldStatus = project.status;
    Object.assign(project, req.body);
    await project.save();
    
    if (oldStatus !== 'Completed' && project.status === 'Completed') {
      for (const memberId of project.members) {
        await User.findByIdAndUpdate(memberId, {
          $inc: { completedProjectsCount: 1 }
        });
      }
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    project.status = 'Terminated';
    project.deletedAt = new Date();
    await project.save();
    
    for (const memberId of project.members) {
      if (memberId.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: memberId,
          type: 'project_update',
          title: 'Project Terminated',
          message: `The project "${project.title}" has been terminated by the host`,
          link: '/dashboard'
        });
      }
      
      await User.findByIdAndUpdate(memberId, {
        $inc: { activeProjectCount: -1 },
        $pull: { currentProjects: project._id, completedProjects: project._id }
      });
    }
    
    res.json({ message: 'Project terminated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { memberId, reason } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (memberId.toString() === project.host.toString()) {
      return res.status(400).json({ message: 'Cannot remove project host' });
    }
    
    const memberExists = project.members.some(m => m.toString() === memberId.toString());
    if (!memberExists) {
      return res.status(404).json({ message: 'Member not found in project' });
    }
    
    project.members = project.members.filter(m => m.toString() !== memberId.toString());
    await project.save();
    
    await User.findByIdAndUpdate(memberId, {
      $inc: { activeProjectCount: -1 },
      $pull: { currentProjects: project._id }
    });
    
    await Notification.create({
      recipient: memberId,
      type: 'project_update',
      title: 'Removed from Project',
      message: reason && reason.trim() 
        ? `You have been removed from "${project.title}". Reason: ${reason}`
        : `You have been removed from "${project.title}"`,
      link: '/dashboard'
    });
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.applyToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.members.length >= project.teamSize) {
      return res.status(400).json({ message: 'Project is full. No slots remaining.' });
    }
    
    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    const existingApplication = project.applications.find(
      app => app.user.toString() === req.user._id.toString()
    );
    
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied' });
    }
    
    project.applications.push({ user: req.user._id });
    await project.save();
    
    await Notification.create({
      recipient: project.host,
      type: 'application',
      title: 'New Application',
      message: `${req.user.profile.name} applied to ${project.title}`,
      link: `/projects/${project._id}/applications`
    });
    
    res.json({ message: 'Application submitted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleApplication = async (req, res) => {
  try {
    const { projectId, userId, action } = req.body;
    
    const project = await Project.findById(projectId);
    
    if (!project || project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (action === 'accept' && project.members.length >= project.teamSize) {
      return res.status(400).json({ message: 'Project is full. Cannot accept more members.' });
    }
    
    const application = project.applications.find(
      app => app.user.toString() === userId
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    application.status = action === 'accept' ? 'Accepted' : 'Rejected';
    
    if (action === 'accept') {
      project.members.push(userId);
      
      await User.findByIdAndUpdate(userId, {
        $inc: { activeProjectCount: 1, selectionFrequency: 1 },
        $push: { currentProjects: project._id }
      });
    }
    
    await project.save();
    
    await Notification.create({
      recipient: userId,
      type: 'selection',
      title: action === 'accept' ? 'Application Accepted' : 'Application Rejected',
      message: `Your application to ${project.title} was ${action}ed`,
      link: `/projects/${project._id}`
    });
    
    res.json({ message: `Application ${action}ed` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMatchingSuggestions = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const candidates = await findMatchingCandidates(project);
    
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userSkills = req.user.profile.skills.map(s => s.name);
    const userInterests = req.user.profile.interests || [];
    
    const projects = await Project.find({
      status: 'Open',
      deletedAt: null,
      host: { $ne: req.user._id },
      members: { $nin: [req.user._id] },
      $or: [
        { 'requiredSkills.skill': { $in: userSkills } },
        { category: { $in: userInterests } }
      ]
    })
      .populate('host', 'username profile.name')
      .limit(10);
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendInvitation = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (project.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }
    
    // Initialize invitations array if it doesn't exist
    if (!project.invitations || !Array.isArray(project.invitations)) {
      project.invitations = [];
    }
    
    const existingInvite = project.invitations.find(
      inv => inv.user && inv.user.toString() === userId && inv.status === 'Pending'
    );
    
    if (existingInvite) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }
    
    project.invitations.push({ user: userId, status: 'Pending' });
    await project.save();
    
    await Notification.create({
      recipient: userId,
      type: 'invitation',
      title: 'Project Invitation',
      message: `You have been invited to join "${project.title}"`,
      link: `/notifications`,
      relatedProject: project._id
    });
    
    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invitation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.respondToInvitation = async (req, res) => {
  try {
    const { projectId, action } = req.body;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (action === 'accept' && project.members.length >= project.teamSize) {
      return res.status(400).json({ message: 'Project is full. Cannot join.' });
    }
    
    // Initialize invitations array if it doesn't exist
    if (!project.invitations || !Array.isArray(project.invitations)) {
      project.invitations = [];
    }
    
    const invitation = project.invitations.find(
      inv => inv.user && inv.user.toString() === req.user._id.toString() && inv.status === 'Pending'
    );
    
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found or already responded' });
    }
    
    invitation.status = action === 'accept' ? 'Accepted' : 'Rejected';
    
    if (action === 'accept') {
      // Add member directly to the project
      if (!project.members.some(m => m.toString() === req.user._id.toString())) {
        project.members.push(req.user._id);
      }
      
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { activeProjectCount: 1, selectionFrequency: 1 },
        $addToSet: { currentProjects: project._id }
      });
      
      // Notify host
      await Notification.create({
        recipient: project.host,
        type: 'invitation_response',
        title: 'Invitation Accepted',
        message: `${req.user.profile.name} accepted your invitation to ${project.title}`,
        link: `/projects/${project._id}`
      });
    } else {
      // Notify host of rejection
      await Notification.create({
        recipient: project.host,
        type: 'invitation_response',
        title: 'Invitation Rejected',
        message: `${req.user.profile.name} rejected your invitation to ${project.title}`,
        link: `/projects/${project._id}`
      });
    }
    
    await project.save();
    
    res.json({ message: `Invitation ${action}ed successfully`, project });
  } catch (error) {
    console.error('Respond to invitation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.rateMembers = async (req, res) => {
  try {
    const { ratings } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project || project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (project.status !== 'Completed') {
      return res.status(400).json({ message: 'Can only rate members after project completion' });
    }
    
    for (const { userId, rating } of ratings) {
      const user = await User.findById(userId);
      if (!user) continue;
      
      const existingRating = project.memberRatings.find(r => r.user.toString() === userId);
      
      if (!existingRating) {
        project.memberRatings.push({ user: userId, rating });
        
        const currentTotalRatings = user.totalRatings || 0;
        const currentScore = user.contributionScore || 3.0;
        
        // Calculate new average: (sum of all previous ratings + new rating) / total ratings
        // currentScore * currentTotalRatings = sum of all previous ratings
        const totalRatingSum = (currentScore * currentTotalRatings) + rating;
        const newTotalRatings = currentTotalRatings + 1;
        const newScore = totalRatingSum / newTotalRatings;
        
        user.contributionScore = newScore;
        user.totalRatings = newTotalRatings;
        await user.save();
        
        await Notification.create({
          recipient: userId,
          type: 'project_update',
          title: 'You Received a Rating',
          message: `You received a ${rating}/5 rating for your contribution in "${project.title}"`,
          link: `/profile`
        });
      }
    }
    
    await project.save();
    res.json({ message: 'Ratings submitted successfully' });
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.endProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    project.status = 'Completed';
    await project.save();
    
    for (const memberId of project.members) {
      await User.findByIdAndUpdate(memberId, {
        $inc: { completedProjectsCount: 1, activeProjectCount: -1 },
        $pull: { currentProjects: project._id },
        $addToSet: { completedProjects: project._id }
      });
      
      await Notification.create({
        recipient: memberId,
        type: 'project_update',
        title: 'Project Completed',
        message: `The project "${project.title}" has been marked as completed. The host can now rate your contribution.`,
        link: `/projects/${project._id}`
      });
    }
    
    res.json({ message: 'Project ended successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
