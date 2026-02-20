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
    
    const query = {};
    
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
    
    if (status) {
      query.status = status;
    } else {
      query.status = 'Open';
    }
    
    const projects = await Project.find(query)
      .populate('host', 'username profile.name')
      .populate('members', 'username profile.name')
      .sort('-createdAt');
    
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
    
    // Notify all members
    for (const memberId of project.members) {
      if (memberId.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: memberId,
          type: 'project_update',
          title: 'Project Terminated',
          message: `The project "${project.title}" has been terminated by the host`,
          link: '/dashboard'
        });
        
        await User.findByIdAndUpdate(memberId, {
          $inc: { activeProjectCount: -1 },
          $pull: { currentProjects: project._id }
        });
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project terminated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { memberId, reason } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project || project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    project.members = project.members.filter(m => m.toString() !== memberId);
    await project.save();
    
    await User.findByIdAndUpdate(memberId, {
      $inc: { activeProjectCount: -1 },
      $pull: { currentProjects: project._id }
    });
    
    if (reason && reason.trim()) {
      await Notification.create({
        recipient: memberId,
        type: 'project_update',
        title: 'Removed from Project',
        message: `You have been removed from "${project.title}". Reason: ${reason}`,
        link: '/dashboard'
      });
    } else {
      await Notification.create({
        recipient: memberId,
        type: 'project_update',
        title: 'Removed from Project',
        message: `You have been removed from "${project.title}"`,
        link: '/dashboard'
      });
    }
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
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
    
    if (!project.invitations) {
      project.invitations = [];
    }
    
    const existingInvite = project.invitations.find(inv => inv.user.toString() === userId);
    if (existingInvite) {
      return res.status(400).json({ message: 'Invitation already sent' });
    }
    
    project.invitations.push({ user: userId });
    await project.save();
    
    await Notification.create({
      recipient: userId,
      type: 'invitation',
      title: 'Project Invitation',
      message: `You have been invited to join "${project.title}"`,
      link: `/projects/${project._id}`
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
    
    const invitation = project.invitations.find(inv => inv.user.toString() === req.user._id.toString());
    if (!invitation) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    
    invitation.status = action === 'accept' ? 'Accepted' : 'Rejected';
    
    if (action === 'accept') {
      project.members.push(req.user._id);
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { activeProjectCount: 1, selectionFrequency: 1 },
        $push: { currentProjects: project._id }
      });
    }
    
    await project.save();
    
    await Notification.create({
      recipient: project.host,
      type: 'invitation_response',
      title: `Invitation ${action}ed`,
      message: `${req.user.profile.name} ${action}ed your invitation to ${project.title}`,
      link: `/projects/${project._id}`
    });
    
    res.json({ message: `Invitation ${action}ed` });
  } catch (error) {
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
      if (existingRating) {
        existingRating.rating = rating;
      } else {
        project.memberRatings.push({ user: userId, rating });
      }
      
      const newTotalRatings = user.totalRatings + 1;
      const newScore = ((user.contributionScore * user.totalRatings) + rating) / newTotalRatings;
      
      await User.findByIdAndUpdate(userId, {
        contributionScore: newScore,
        totalRatings: newTotalRatings
      });
    }
    
    await project.save();
    res.json({ message: 'Ratings submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
