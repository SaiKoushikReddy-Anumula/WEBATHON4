const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const users = [
  {
    username: "user1",
    email: "user1@gmail.com",
    password: "user1",
    isVerified: true,
    profile: {
      name: "User One",
      profilePicture: "",
      branch: "CSE",
      year: "3rd Year",
      bio: "Full stack developer interested in civic platforms.",
      skills: [
        { name: "React", proficiency: "Advanced" },
        { name: "Node.js", proficiency: "Advanced" },
        { name: "MongoDB", proficiency: "Intermediate" }
      ],
      interests: ["Civic Tech", "Web Apps"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user2",
    email: "user2@gmail.com",
    password: "user2",
    isVerified: true,
    profile: {
      name: "User Two",
      profilePicture: "",
      branch: "IT",
      year: "2nd Year",
      bio: "Frontend developer and UI enthusiast.",
      skills: [
        { name: "React", proficiency: "Intermediate" },
        { name: "Figma", proficiency: "Advanced" }
      ],
      interests: ["Design", "Civic Tech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user3",
    email: "user3@gmail.com",
    password: "user3",
    isVerified: true,
    profile: {
      name: "User Three",
      profilePicture: "",
      branch: "CSE",
      year: "4th Year",
      bio: "Backend developer and system designer.",
      skills: [
        { name: "Node.js", proficiency: "Intermediate" },
        { name: "Java", proficiency: "Advanced" }
      ],
      interests: ["Backend", "Web Apps"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user4",
    email: "user4@gmail.com",
    password: "user4",
    isVerified: true,
    profile: {
      name: "User Four",
      profilePicture: "",
      branch: "CSE",
      year: "3rd Year",
      bio: "Machine learning enthusiast for AgriTech.",
      skills: [
        { name: "Python", proficiency: "Advanced" },
        { name: "Machine Learning", proficiency: "Intermediate" }
      ],
      interests: ["AI", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user5",
    email: "user5@gmail.com",
    password: "user5",
    isVerified: true,
    profile: {
      name: "User Five",
      profilePicture: "",
      branch: "IT",
      year: "2nd Year",
      bio: "Python developer interested in data projects.",
      skills: [
        { name: "Python", proficiency: "Intermediate" },
        { name: "Data Analysis", proficiency: "Intermediate" }
      ],
      interests: ["Data", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user6",
    email: "user6@gmail.com",
    password: "user6",
    isVerified: true,
    profile: {
      name: "User Six",
      profilePicture: "",
      branch: "CSE",
      year: "3rd Year",
      bio: "Cloud and DevOps learner.",
      skills: [
        { name: "AWS", proficiency: "Intermediate" },
        { name: "Docker", proficiency: "Intermediate" }
      ],
      interests: ["Cloud", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user7",
    email: "user7@gmail.com",
    password: "user7",
    isVerified: true,
    profile: {
      name: "User Seven",
      profilePicture: "",
      branch: "CSE",
      year: "2nd Year",
      bio: "Mobile and frontend developer.",
      skills: [
        { name: "Flutter", proficiency: "Intermediate" },
        { name: "React", proficiency: "Beginner" }
      ],
      interests: ["Mobile Apps", "Civic Tech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user8",
    email: "user8@gmail.com",
    password: "user8",
    isVerified: true,
    profile: {
      name: "User Eight",
      profilePicture: "",
      branch: "CSE",
      year: "4th Year",
      bio: "Optimization and backend developer.",
      skills: [
        { name: "Python", proficiency: "Intermediate" },
        { name: "Algorithms", proficiency: "Advanced" }
      ],
      interests: ["Optimization", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user9",
    email: "user9@gmail.com",
    password: "user9",
    isVerified: true,
    profile: {
      name: "User Nine",
      profilePicture: "",
      branch: "ECE",
      year: "3rd Year",
      bio: "IoT and smart infrastructure enthusiast.",
      skills: [
        { name: "Arduino", proficiency: "Intermediate" },
        { name: "Python", proficiency: "Beginner" }
      ],
      interests: ["Smart Infrastructure", "Civic Tech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  },
  {
    username: "user10",
    email: "user10@gmail.com",
    password: "user10",
    isVerified: true,
    profile: {
      name: "User Ten",
      profilePicture: "",
      branch: "IT",
      year: "2nd Year",
      bio: "Team coordinator and documentation specialist.",
      skills: [
        { name: "Communication", proficiency: "Advanced" },
        { name: "Project Management", proficiency: "Intermediate" },
        { name: "React", proficiency: "Beginner" }
      ],
      interests: ["Leadership", "Campus Projects"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: []
  }
];

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of users) {
      const user = await User.findOne({ username: userData.username });
      
      if (!user) {
        console.log(`User ${userData.username} not found, creating...`);
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        await User.create({ ...userData, password: hashedPassword });
        console.log(`Created user: ${userData.username}`);
      } else {
        console.log(`Updating user: ${userData.username}`);
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        await User.updateOne(
          { username: userData.username },
          { 
            $set: { 
              password: hashedPassword,
              isVerified: userData.isVerified,
              profile: userData.profile
            }
          }
        );
        console.log(`Updated user: ${userData.username}`);
      }
    }

    console.log('Update completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateUsers();
