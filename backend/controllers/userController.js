const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id || req.user._id)
      .select('-password')
      .populate('currentProjects', 'title status');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate actual active project count from currentProjects array
    const actualActiveCount = user.currentProjects?.length || 0;
    if (user.activeProjectCount !== actualActiveCount) {
      user.activeProjectCount = actualActiveCount;
      await user.save();
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Merge profile updates
    user.profile = { ...user.profile.toObject(), ...updates };
    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { skills, availability, minProjects, maxProjects, minScore, maxScore } = req.query;
    
    const query = { isVerified: true };
    
    if (skills) {
      const skillArray = skills.split(',').map(s => {
        const normalized = s.trim().toLowerCase().replace(/\s+/g, '');
        return new RegExp(normalized, 'i');
      });
      query['profile.skills.name'] = { $in: skillArray };
    }
    
    if (availability) {
      query['profile.availability'] = availability;
    }
    
    if (minProjects) {
      query.activeProjectCount = { $gte: parseInt(minProjects) };
    }
    
    if (maxProjects) {
      query.activeProjectCount = { ...query.activeProjectCount, $lte: parseInt(maxProjects) };
    }
    
    if (minScore) {
      query.contributionScore = { $gte: parseFloat(minScore) };
    }
    
    if (maxScore) {
      query.contributionScore = { ...query.contributionScore, $lte: parseFloat(maxScore) };
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ contributionScore: -1, activeProjectCount: -1 })
      .limit(50);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
