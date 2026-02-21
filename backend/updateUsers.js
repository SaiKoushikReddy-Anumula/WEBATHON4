const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = [
      { username: "user1", email: "user1@gmail.com", password: "user1", profile: { name: "User One", branch: "CSE", year: "3rd Year", bio: "Full stack developer interested in civic platforms.", skills: [{ name: "Web Development", proficiency: "Advanced" }, { name: "API Integration", proficiency: "Intermediate" }, { name: "Database Management", proficiency: "Intermediate" }, { name: "Full Stack Development", proficiency: "Advanced" }], interests: ["Civic Tech", "Web Apps"], availability: "Available" }},
      { username: "user2", email: "user2@gmail.com", password: "user2", profile: { name: "User Two", branch: "IT", year: "2nd Year", bio: "Frontend developer and UI enthusiast.", skills: [{ name: "UI/UX Design", proficiency: "Advanced" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "Mobile App Development", proficiency: "Intermediate" }], interests: ["Design", "Civic Tech"], availability: "Available" }},
      { username: "user3", email: "user3@gmail.com", password: "user3", profile: { name: "User Three", branch: "CSE", year: "4th Year", bio: "Backend developer and system designer.", skills: [{ name: "Backend Development", proficiency: "Advanced" }, { name: "Database Management", proficiency: "Advanced" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "Cloud Deployment", proficiency: "Intermediate" }], interests: ["Backend", "Web Apps"], availability: "Available" }},
      { username: "user4", email: "user4@gmail.com", password: "user4", profile: { name: "User Four", branch: "CSE", year: "3rd Year", bio: "Machine learning enthusiast for AgriTech.", skills: [{ name: "Machine Learning", proficiency: "Advanced" }, { name: "Computer Vision", proficiency: "Intermediate" }, { name: "Data Analysis", proficiency: "Intermediate" }, { name: "Data Analytics", proficiency: "Intermediate" }], interests: ["AI", "AgriTech"], availability: "Available" }},
      { username: "user5", email: "user5@gmail.com", password: "user5", profile: { name: "User Five", branch: "IT", year: "2nd Year", bio: "Python developer interested in data projects.", skills: [{ name: "Data Analysis", proficiency: "Intermediate" }, { name: "Cloud Computing", proficiency: "Intermediate" }, { name: "Data Analytics", proficiency: "Intermediate" }, { name: "Cloud Integration", proficiency: "Intermediate" }], interests: ["Data", "AgriTech"], availability: "Available" }},
      { username: "user6", email: "user6@gmail.com", password: "user6", profile: { name: "User Six", branch: "CSE", year: "3rd Year", bio: "Cloud and DevOps learner.", skills: [{ name: "Cloud Computing", proficiency: "Intermediate" }, { name: "Cloud Deployment", proficiency: "Intermediate" }, { name: "Cloud Integration", proficiency: "Intermediate" }, { name: "Backend Development", proficiency: "Intermediate" }], interests: ["Cloud", "AgriTech"], availability: "Available" }},
      { username: "user7", email: "user7@gmail.com", password: "user7", profile: { name: "User Seven", branch: "CSE", year: "2nd Year", bio: "Mobile and frontend developer.", skills: [{ name: "Mobile App Development", proficiency: "Intermediate" }, { name: "Full Stack Development", proficiency: "Intermediate" }, { name: "Web Development", proficiency: "Intermediate" }], interests: ["Mobile Apps", "Civic Tech"], availability: "Available" }},
      { username: "user8", email: "user8@gmail.com", password: "user8", profile: { name: "User Eight", branch: "CSE", year: "4th Year", bio: "NLP and backend specialist.", skills: [{ name: "Natural Language Processing", proficiency: "Intermediate" }, { name: "Backend Development", proficiency: "Intermediate" }, { name: "Text-to-Speech Integration", proficiency: "Intermediate" }, { name: "Machine Learning", proficiency: "Intermediate" }], interests: ["AI", "Research"], availability: "Available" }},
      { username: "user9", email: "user9@gmail.com", password: "user9", profile: { name: "User Nine", branch: "ECE", year: "3rd Year", bio: "Payment and integration specialist.", skills: [{ name: "Payment Gateway Integration", proficiency: "Intermediate" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "API Integration", proficiency: "Intermediate" }, { name: "Database Management", proficiency: "Intermediate" }], interests: ["Fintech", "Web Apps"], availability: "Available" }},
      { username: "user10", email: "user10@gmail.com", password: "user10", profile: { name: "User Ten", branch: "IT", year: "2nd Year", bio: "Full stack developer and designer.", skills: [{ name: "Full Stack Development", proficiency: "Intermediate" }, { name: "UI/UX Design", proficiency: "Intermediate" }, { name: "Web Development", proficiency: "Intermediate" }, { name: "Database Management", proficiency: "Intermediate" }], interests: ["Web Development", "Design"], availability: "Available" }},
      { username: "nani", email: "nani@gmail.com", password: "@Saikoushik45", profile: { name: "Nani", branch: "CSE", year: "3rd Year", bio: "Full stack developer.", skills: [{ name: "Full Stack Development", proficiency: "Advanced" }, { name: "Web Development", proficiency: "Advanced" }, { name: "Backend Development", proficiency: "Advanced" }], interests: ["Web Development"], availability: "Available" }}
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ username: userData.username });
      
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      if (existingUser) {
        await User.updateOne(
          { username: userData.username },
          {
            $set: {
              password: hashedPassword,
              'profile.skills': userData.profile.skills,
              contributionScore: 3.0,
              totalRatings: 0,
              selectionFrequency: 0,
              activeProjectCount: 0,
              completedProjectsCount: 0,
              currentProjects: [],
              completedProjects: []
            }
          }
        );
        console.log(`Reset user: ${userData.username}`);
      } else {
        await User.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          isVerified: true,
          profile: userData.profile,
          contributionScore: 3.0,
          totalRatings: 0,
          selectionFrequency: 0,
          activeProjectCount: 0,
          completedProjectsCount: 0,
          currentProjects: [],
          completedProjects: []
        });
        console.log(`Created user: ${userData.username}`);
      }
    }

    console.log('All users reset to default values!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateUsers();
