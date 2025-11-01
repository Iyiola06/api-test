/**
 * Database Seeding Script
 * Run with: node scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected for seeding');
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const users = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@devsync.ai',
    password: 'Password123!',
    role: 'product_manager',
    department: 'Product',
    bio: 'Experienced Product Manager with 10+ years in tech'
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@devsync.ai',
    password: 'Password123!',
    role: 'backend_developer',
    department: 'Engineering',
    bio: 'Backend developer specializing in Node.js and Python',
    skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL']
  },
  {
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.williams@devsync.ai',
    password: 'Password123!',
    role: 'frontend_developer',
    department: 'Engineering',
    bio: 'Frontend developer passionate about React and UX',
    skills: ['React', 'TypeScript', 'CSS', 'Next.js']
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@devsync.ai',
    password: 'Password123!',
    role: 'qa_engineer',
    department: 'Quality Assurance',
    bio: 'QA Engineer focused on automation and quality',
    skills: ['Jest', 'Selenium', 'API Testing', 'Performance Testing']
  },
  {
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@devsync.ai',
    password: 'Password123!',
    role: 'devops_engineer',
    department: 'DevOps',
    bio: 'DevOps engineer with expertise in CI/CD and cloud',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins']
  },
  {
    firstName: 'Frank',
    lastName: 'Wilson',
    email: 'frank.wilson@devsync.ai',
    password: 'Password123!',
    role: 'product_designer',
    department: 'Design',
    bio: 'Product Designer focusing on user-centered design',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping']
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    
    logger.info('Cleared existing data');

    // Create users
    const createdUsers = await User.create(users);
    logger.info(`Created ${createdUsers.length} users`);

    // Create sample project
    const pmUser = createdUsers.find(u => u.role === 'product_manager');
    
    const project = await Project.create({
      name: 'DevSync AI Platform',
      description: 'Building an intelligent project management and development coordination platform',
      key: 'DSA',
      status: 'active',
      priority: 'high',
      owner: pmUser._id,
      team: createdUsers.map(user => ({
        user: user._id,
        role: user.role
      })),
      startDate: new Date(),
      targetEndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
      tags: ['ai', 'project-management', 'collaboration'],
      repository: {
        provider: 'github',
        url: 'https://github.com/devsync/devsync-ai',
        branch: 'main'
      },
      cicd: {
        enabled: true,
        provider: 'github_actions'
      }
    });

    logger.info(`Created project: ${project.name}`);

    logger.info('Database seeding completed successfully!');
    logger.info('\nTest Credentials:');
    logger.info('Email: alice.johnson@devsync.ai | Password: Password123! | Role: Product Manager');
    logger.info('Email: bob.smith@devsync.ai | Password: Password123! | Role: Backend Developer');
    logger.info('Email: carol.williams@devsync.ai | Password: Password123! | Role: Frontend Developer');
    logger.info('Email: david.brown@devsync.ai | Password: Password123! | Role: QA Engineer');
    logger.info('Email: emma.davis@devsync.ai | Password: Password123! | Role: DevOps Engineer');
    logger.info('Email: frank.wilson@devsync.ai | Password: Password123! | Role: Product Designer');

    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Run seeding
connectDB().then(seedDatabase);
