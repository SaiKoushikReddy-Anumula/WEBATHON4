const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');

const fixUserStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    
    for (const user of users) {
      // Get actual active projects (not completed, not terminated)
      const activeProjects = await Project.find({
        members: user._id,
        status: { $nin: ['Completed', 'Terminated'] },
        deletedAt: null
      });

      // Get actual completed projects
      const completedProjects = await Project.find({
        members: user._id,
        status: 'Completed',
        deletedAt: null
      });

      const actualActiveCount = activeProjects.length;
      const actualCompletedCount = completedProjects.length;
      const activeProjectIds = activeProjects.map(p => p._id);
      const completedProjectIds = completedProjects.map(p => p._id);

      // Update user with correct values
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            activeProjectCount: actualActiveCount,
            completedProjectsCount: actualCompletedCount,
            currentProjects: activeProjectIds,
            completedProjects: completedProjectIds
          }
        }
      );

      console.log(`Fixed ${user.username}: Active=${actualActiveCount}, Completed=${actualCompletedCount}`);
    }

    console.log('All user statistics fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing user stats:', error);
    process.exit(1);
  }
};

fixUserStats();
