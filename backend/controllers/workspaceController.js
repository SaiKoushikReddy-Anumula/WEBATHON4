const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.addTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (!project.workspace) {
      project.workspace = {};
    }
    if (!project.workspace.tasks) {
      project.workspace.tasks = [];
    }
    if (!project.workspace.activityLog) {
      project.workspace.activityLog = [];
    }
    
    const newTask = {
      title: req.body.title,
      description: req.body.description || '',
      assignedTo: req.body.assignedTo || null,
      status: 'To Do',
      createdAt: new Date()
    };
    
    project.workspace.tasks.push(newTask);
    project.workspace.activityLog.push({
      user: req.user._id,
      action: `Created task: ${req.body.title}`,
      timestamp: new Date()
    });
    
    await project.save();
    
    res.json(project.workspace.tasks);
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const task = project.workspace.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    Object.assign(task, req.body);
    
    project.workspace.activityLog.push({
      user: req.user._id,
      action: `Updated task: ${task.title}`
    });
    
    await project.save();
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project || !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { threadName, content } = req.body;
    
    if (!project.workspace) {
      project.workspace = { threads: [], tasks: [], files: [], activityLog: [] };
    }
    if (!project.workspace.threads) {
      project.workspace.threads = [];
    }
    
    let thread = project.workspace.threads.find(t => t.name === threadName);
    
    if (!thread) {
      thread = { name: threadName, messages: [] };
      project.workspace.threads.push(thread);
    }
    
    thread.messages.push({
      user: req.user._id,
      content
    });
    
    await project.save();
    
    res.json(thread);
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkspace = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('workspace.tasks.assignedTo', 'username profile.name')
      .populate('workspace.threads.messages.user', 'username profile.name')
      .populate('workspace.activityLog.user', 'username profile.name');
    
    if (!project || !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (!project.workspace) {
      project.workspace = { threads: [], tasks: [], files: [], activityLog: [] };
      await project.save();
    }
    
    res.json(project.workspace);
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ message: error.message });
  }
};
