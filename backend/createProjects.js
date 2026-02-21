const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');

const createProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const nani = await User.findOne({ username: 'nani' });
    if (!nani) {
      console.error('User nani not found');
      process.exit(1);
    }

    const projects = [
      {
        title: 'The Civic Micro-Task Platform',
        description: 'A neighborhood-level platform that converts civic engagement into quick micro-tasks. Citizens can report issues like broken streetlights, damaged footpaths, or faded notices. Local authorities post verification and reporting tasks. Users complete tasks in minutes, upload proof, and track measurable impact, building trust between residents and civic bodies.',
        category: 'Hackathon',
        teamSize: 3,
        hostRole: 'Team Lead, Backend Developer',
        deadline: new Date('2026-06-30'),
        weeklyCommitment: '10–12 hours',
        requiredSkills: [
          { skill: 'Web Development', minProficiency: 'Intermediate' },
          { skill: 'API Integration', minProficiency: 'Intermediate' },
          { skill: 'UI/UX Design', minProficiency: 'Beginner' },
          { skill: 'Database Management', minProficiency: 'Intermediate' }
        ],
        requiredRoles: [
          { role: 'Frontend Developer', count: 1 },
          { role: 'Backend Developer', count: 1 },
          { role: 'UI/UX Designer', count: 1 }
        ]
      },
      {
        title: 'Bringing Predictability to Perishable Farming',
        description: 'A digital platform that enables farmers to make informed pre-harvest decisions through demand forecasting, supply aggregation, logistics coordination, and pre-harvest buyer commitments. It reduces spoilage, stabilizes income, and improves transparency in the agricultural supply chain.',
        category: 'Startup',
        teamSize: 3,
        hostRole: 'Backend Developer, Data Analyst',
        deadline: new Date('2026-07-15'),
        weeklyCommitment: '12–15 hours',
        requiredSkills: [
          { skill: 'Data Analysis', minProficiency: 'Intermediate' },
          { skill: 'Web Development', minProficiency: 'Intermediate' },
          { skill: 'Cloud Computing', minProficiency: 'Intermediate' },
          { skill: 'Database Management', minProficiency: 'Intermediate' }
        ],
        requiredRoles: [
          { role: 'Backend Developer', count: 1 },
          { role: 'Frontend Developer', count: 1 },
          { role: 'Data Analyst', count: 1 }
        ]
      },
      {
        title: 'Recovery Companion – Staying Connected After Discharge',
        description: 'A smart recovery tracking system that allows patients to log daily symptoms like pain, fatigue, swelling, mood, and sleep. The platform analyzes trends, provides stage-specific guidance, and flags concerning patterns to healthcare providers. It reduces readmission risks and improves recovery visibility.',
        category: 'Research',
        teamSize: 3,
        hostRole: 'Full Stack Developer, Research Lead',
        deadline: new Date('2026-07-20'),
        weeklyCommitment: '12–14 hours',
        requiredSkills: [
          { skill: 'Full Stack Development', minProficiency: 'Intermediate' },
          { skill: 'Data Analytics', minProficiency: 'Intermediate' },
          { skill: 'UI/UX Design', minProficiency: 'Beginner' },
          { skill: 'Cloud Integration', minProficiency: 'Intermediate' }
        ],
        requiredRoles: [
          { role: 'Full Stack Developer', count: 1 },
          { role: 'Data Analyst', count: 1 },
          { role: 'UI/UX Designer', count: 1 }
        ]
      }
    ];

    for (const projectData of projects) {
      const project = await Project.create({
        ...projectData,
        host: nani._id,
        members: [nani._id],
        status: 'Open'
      });
      console.log(`Created project: ${project.title}`);
    }

    await User.findByIdAndUpdate(nani._id, {
      $inc: { activeProjectCount: 3 },
      $push: { currentProjects: { $each: await Project.find({ host: nani._id }).distinct('_id') } }
    });

    console.log('All projects created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating projects:', error);
    process.exit(1);
  }
};

createProjects();
