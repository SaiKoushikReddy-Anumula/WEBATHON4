const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const updateSkillsOnly = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const skillUpdates = [
      { username: "user1", skills: [{ name: "Web Development", proficiency: "Advanced" }, { name: "API Integration", proficiency: "Intermediate" }, { name: "Database Management", proficiency: "Intermediate" }, { name: "Full Stack Development", proficiency: "Advanced" }] },
      { username: "user2", skills: [{ name: "UI/UX Design", proficiency: "Advanced" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "Mobile App Development", proficiency: "Intermediate" }] },
      { username: "user3", skills: [{ name: "Backend Development", proficiency: "Advanced" }, { name: "Database Management", proficiency: "Advanced" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "Cloud Deployment", proficiency: "Intermediate" }] },
      { username: "user4", skills: [{ name: "Machine Learning", proficiency: "Advanced" }, { name: "Computer Vision", proficiency: "Intermediate" }, { name: "Data Analysis", proficiency: "Intermediate" }, { name: "Data Analytics", proficiency: "Intermediate" }] },
      { username: "user5", skills: [{ name: "Data Analysis", proficiency: "Intermediate" }, { name: "Cloud Computing", proficiency: "Intermediate" }, { name: "Data Analytics", proficiency: "Intermediate" }, { name: "Cloud Integration", proficiency: "Intermediate" }] },
      { username: "user6", skills: [{ name: "Cloud Computing", proficiency: "Intermediate" }, { name: "Cloud Deployment", proficiency: "Intermediate" }, { name: "Cloud Integration", proficiency: "Intermediate" }, { name: "Backend Development", proficiency: "Intermediate" }] },
      { username: "user7", skills: [{ name: "Mobile App Development", proficiency: "Intermediate" }, { name: "Full Stack Development", proficiency: "Intermediate" }, { name: "Web Development", proficiency: "Intermediate" }] },
      { username: "user8", skills: [{ name: "Natural Language Processing", proficiency: "Intermediate" }, { name: "Backend Development", proficiency: "Intermediate" }, { name: "Text-to-Speech Integration", proficiency: "Intermediate" }, { name: "Machine Learning", proficiency: "Intermediate" }] },
      { username: "user9", skills: [{ name: "Payment Gateway Integration", proficiency: "Intermediate" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "API Integration", proficiency: "Intermediate" }, { name: "Database Management", proficiency: "Intermediate" }] },
      { username: "user10", skills: [{ name: "Full Stack Development", proficiency: "Intermediate" }, { name: "UI/UX Design", proficiency: "Intermediate" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "Database Management", proficiency: "Intermediate" }] }
    ];

    for (const update of skillUpdates) {
      await User.updateOne(
        { username: update.username },
        { $set: { 'profile.skills': update.skills } }
      );
      console.log(`Updated skills for: ${update.username}`);
    }

    console.log('Skills updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating skills:', error);
    process.exit(1);
  }
};

updateSkillsOnly();
