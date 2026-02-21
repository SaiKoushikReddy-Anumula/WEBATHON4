const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');

const resetProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete all projects
    await Project.deleteMany({});
    console.log('Deleted all existing projects');

    // Reset ALL users' project counts (including nani and krishna)
    await User.updateMany({}, {
      $set: {
        activeProjectCount: 0,
        completedProjectsCount: 0,
        selectionFrequency: 0,
        currentProjects: [],
        completedProjects: []
      }
    });
    console.log('Reset ALL users project counts to zero');

    // Get nani and Krishna_Manohar
    const nani = await User.findOne({ username: 'nani' });
    const krishna = await User.findOne({ username: 'Krishna_Manohar' });

    if (!nani || !krishna) {
      console.error('Users not found');
      process.exit(1);
    }

    // Nani's projects
    const naniProjects = [
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
        ],
        host: nani._id,
        members: [nani._id],
        status: 'Open'
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
        ],
        host: nani._id,
        members: [nani._id],
        status: 'Open'
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
        ],
        host: nani._id,
        members: [nani._id],
        status: 'Open'
      }
    ];

    // Krishna's projects
    const krishnaProjects = [
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
          { skill: 'Machine Learning', minProficiency: 'Intermediate' },
          { skill: 'Computer Vision', minProficiency: 'Intermediate' },
          { skill: 'Mobile App Development', minProficiency: 'Intermediate' },
          { skill: 'UI/UX Design', minProficiency: 'Beginner' }
        ],
        requiredRoles: [
          { role: 'Full Stack Developer', count: 1 },
          { role: 'ML Engineer', count: 1 },
          { role: 'UI/UX Designer', count: 1 }
        ],
        host: krishna._id,
        members: [krishna._id],
        status: 'Open'
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
        ],
        host: krishna._id,
        members: [krishna._id],
        status: 'Open'
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
        ],
        host: krishna._id,
        members: [krishna._id],
        status: 'Open'
      }
    ];

    // Create all projects
    const naniProjectIds = [];
    for (const proj of naniProjects) {
      const created = await Project.create(proj);
      naniProjectIds.push(created._id);
      console.log(`Created: ${created.title}`);
    }

    const krishnaProjectIds = [];
    for (const proj of krishnaProjects) {
      const created = await Project.create(proj);
      krishnaProjectIds.push(created._id);
      console.log(`Created: ${created.title}`);
    }

    // Update user project counts
    await User.findByIdAndUpdate(nani._id, {
      activeProjectCount: 3,
      currentProjects: naniProjectIds
    });

    await User.findByIdAndUpdate(krishna._id, {
      activeProjectCount: 3,
      currentProjects: krishnaProjectIds
    });

    console.log('\n✅ All projects reset successfully!');
    console.log('Nani: 3 projects');
    console.log('Krishna_Manohar: 3 projects');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetProjects();
