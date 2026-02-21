const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');

const createKrishnaProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create Krishna_Manohar user if doesn't exist
    let krishna = await User.findOne({ username: 'Krishna_Manohar' });
    
    if (!krishna) {
      const hashedPassword = await bcrypt.hash('Krishna@123', 12);
      krishna = await User.create({
        username: 'Krishna_Manohar',
        email: 'krishna@gmail.com',
        password: hashedPassword,
        isVerified: true,
        profile: {
          name: 'Krishna Manohar',
          branch: 'CSE',
          year: '3rd Year',
          bio: 'AI/ML enthusiast and full stack developer',
          skills: [
            { name: 'Full Stack Development', proficiency: 'Advanced' },
            { name: 'Machine Learning', proficiency: 'Intermediate' },
            { name: 'Python', proficiency: 'Advanced' },
            { name: 'React', proficiency: 'Advanced' }
          ],
          interests: ['AI', 'Startups', 'Research'],
          availability: 'Available'
        },
        contributionScore: 3.0,
        totalRatings: 0,
        selectionFrequency: 0,
        activeProjectCount: 0,
        completedProjectsCount: 0,
        currentProjects: [],
        completedProjects: []
      });
      console.log('Created user: Krishna_Manohar');
    }

    const projects = [
      {
        title: 'Adaptive Fitness Companion',
        description: 'A personalized fitness platform that adapts to user level, goals, and progress. It provides structured training plans, posture/form feedback using AI-based motion analysis, practical nutrition suggestions based on available resources, and performance tracking dashboards. The system evolves with the user to ensure measurable improvement and reduced injury risk.',
        category: 'Startup',
        teamSize: 3,
        hostRole: 'Full Stack Developer, AI Integration Lead',
        deadline: new Date('2026-07-25'),
        weeklyCommitment: '12–15 hours',
        requiredSkills: [
          { skill: 'Full Stack Development', minProficiency: 'Intermediate' },
          { skill: 'Machine Learning / Computer Vision', minProficiency: 'Intermediate' },
          { skill: 'Mobile App Development', minProficiency: 'Intermediate' },
          { skill: 'UI/UX Design', minProficiency: 'Beginner' }
        ],
        requiredRoles: [
          { role: 'Full Stack Developer', count: 1 },
          { role: 'ML Engineer', count: 1 },
          { role: 'UI/UX Designer', count: 1 }
        ]
      },
      {
        title: 'PocketFlex – Smart Micro-Earnings for Students',
        description: 'A flexible micro-earning platform designed specifically for students. It allows students to convert small pockets of time and practical skills (notes sharing, poster design, tutoring, coding help, event assistance) into structured, reliable income. The system focuses on campus-based opportunities, flexible commitments, and low-entry skill requirements.',
        category: 'Startup',
        teamSize: 3,
        hostRole: 'Backend Developer, Product Strategist',
        deadline: new Date('2026-07-28'),
        weeklyCommitment: '10–12 hours',
        requiredSkills: [
          { skill: 'Web Development', minProficiency: 'Intermediate' },
          { skill: 'Database Management', minProficiency: 'Intermediate' },
          { skill: 'Payment Gateway Integration', minProficiency: 'Intermediate' },
          { skill: 'UI/UX Design', minProficiency: 'Beginner' }
        ],
        requiredRoles: [
          { role: 'Backend Developer', count: 1 },
          { role: 'Frontend Developer', count: 1 },
          { role: 'Product/Community Manager', count: 1 }
        ]
      },
      {
        title: 'From Paper to Podcast – Research-to-Dialogue Converter',
        description: 'A system that converts academic research papers (PDFs) into engaging two-person podcast-style conversations. It extracts key ideas, generates structured explanations, and produces natural-sounding audio discussions to improve comprehension and accessibility. Users can listen to research while commuting or multitasking without losing conceptual depth.',
        category: 'Research',
        teamSize: 3,
        hostRole: 'AI Developer, NLP Engineer',
        deadline: new Date('2026-07-30'),
        weeklyCommitment: '12–15 hours',
        requiredSkills: [
          { skill: 'Natural Language Processing', minProficiency: 'Intermediate' },
          { skill: 'Text-to-Speech Integration', minProficiency: 'Intermediate' },
          { skill: 'Backend Development', minProficiency: 'Intermediate' },
          { skill: 'Cloud Deployment', minProficiency: 'Intermediate' }
        ],
        requiredRoles: [
          { role: 'NLP Engineer', count: 1 },
          { role: 'Backend Developer', count: 1 },
          { role: 'Audio/Voice Integration Specialist', count: 1 }
        ]
      }
    ];

    const createdProjectIds = [];
    for (const projectData of projects) {
      const project = await Project.create({
        ...projectData,
        host: krishna._id,
        members: [krishna._id],
        status: 'Open'
      });
      createdProjectIds.push(project._id);
      console.log(`Created project: ${project.title}`);
    }

    await User.findByIdAndUpdate(krishna._id, {
      $inc: { activeProjectCount: 3 },
      $push: { currentProjects: { $each: createdProjectIds } }
    });

    console.log('All projects created successfully for Krishna_Manohar!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating projects:', error);
    process.exit(1);
  }
};

createKrishnaProjects();
