const InterviewChat = require('../models/InterviewChat');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

exports.createInterviewChat = async (req, res) => {
  try {
    const { projectId, applicantId } = req.body;
    
    const project = await Project.findById(projectId);
    
    if (!project || project.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const existingChat = await InterviewChat.findOne({
      project: projectId,
      applicant: applicantId,
      status: 'Active'
    });
    
    if (existingChat) {
      return res.json(existingChat);
    }
    
    const chat = await InterviewChat.create({
      project: projectId,
      host: req.user._id,
      applicant: applicantId
    });
    
    await Notification.create({
      recipient: applicantId,
      type: 'interview',
      title: 'Interview Request',
      message: `${req.user.profile.name} wants to interview you for ${project.title}`,
      link: `/interview/${chat._id}`
    });
    
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterviewChats = async (req, res) => {
  try {
    const chats = await InterviewChat.find({
      $or: [{ host: req.user._id }, { applicant: req.user._id }],
      status: 'Active'
    })
      .populate('project', 'title')
      .populate('host', 'username profile.name')
      .populate('applicant', 'username profile.name');
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInterviewChat = async (req, res) => {
  try {
    const chat = await InterviewChat.findById(req.params.id)
      .populate('project', 'title')
      .populate('host', 'username profile')
      .populate('applicant', 'username profile')
      .populate('messages.sender', 'username profile.name');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    if (chat.host.toString() !== req.user._id.toString() && 
        chat.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
