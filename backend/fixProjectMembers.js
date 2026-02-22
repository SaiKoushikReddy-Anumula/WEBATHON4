require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const fixProjectMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const projects = await Project.find({});
    
    for (const project of projects) {
      if (!project.members.includes(project.host)) {
        project.members.push(project.host);
        await project.save();
        console.log(`Added host to project: ${project.title}`);
      }
    }

    console.log('Fixed all projects');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixProjectMembers();
