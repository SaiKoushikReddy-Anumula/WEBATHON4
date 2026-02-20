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
    
    Object.assign(project, req.body);
    await project.save();
    
    res.json(project);
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
