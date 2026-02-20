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
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "UI/UX designer for social impact projects.",
      skills: [
        { name: "Figma", proficiency: "Advanced" },
        { name: "UI/UX", proficiency: "Intermediate" }
      ],
      interests: ["Design", "Social Impact"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "Backend developer focused on scalable systems.",
      skills: [
        { name: "Java", proficiency: "Advanced" },
        { name: "Spring Boot", proficiency: "Intermediate" }
      ],
      interests: ["Backend", "Civic Platforms"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "Cloud and DevOps learner.",
      skills: [
        { name: "AWS", proficiency: "Intermediate" },
        { name: "Docker", proficiency: "Intermediate" }
      ],
      interests: ["Cloud", "Supply Chain"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "Data analytics student.",
      skills: [
        { name: "Data Analysis", proficiency: "Intermediate" },
        { name: "SQL", proficiency: "Intermediate" }
      ],
      interests: ["Data", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "Mobile developer for civic applications.",
      skills: [
        { name: "Flutter", proficiency: "Intermediate" },
        { name: "Firebase", proficiency: "Intermediate" }
      ],
      interests: ["Mobile Apps", "Civic Tech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "Algorithm and optimization enthusiast.",
      skills: [
        { name: "C++", proficiency: "Advanced" },
        { name: "Algorithms", proficiency: "Advanced" }
      ],
      interests: ["Optimization", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "IoT enthusiast for smart systems.",
      skills: [
        { name: "Arduino", proficiency: "Intermediate" },
        { name: "Sensors", proficiency: "Intermediate" }
      ],
      interests: ["Smart Infrastructure", "AgriTech"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
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
      bio: "Interested in documentation and coordination.",
      skills: [
        { name: "Communication", proficiency: "Advanced" },
        { name: "Project Management", proficiency: "Intermediate" }
      ],
      interests: ["Leadership", "Campus Projects"],
      workExperience: [],
      availability: "Available"
    },
    selectionFrequency: 0,
    activeProjectCount: 0,
    currentProjects: [],
    contributionScore: 3.0,
    totalRatings: 0
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of users) {
      const existingUser = await User.findOne({ 
        $or: [{ email: userData.email }, { username: userData.username }] 
      });
      
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping...`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.username}`);
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
