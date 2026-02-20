const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const userUpdates = [
      { username: 'user1', password: 'user1' },
      { username: 'user2', password: 'user2' },
      { username: 'user3', password: 'user3' },
      { username: 'user4', password: 'user4' },
      { username: 'user5', password: 'user5' },
      { username: 'user6', password: 'user6' },
      { username: 'user7', password: 'user7' },
      { username: 'user8', password: 'user8' },
      { username: 'user9', password: 'user9' },
      { username: 'user10', password: 'user10' }
    ];

    for (const { username, password } of userUpdates) {
      const user = await User.findOne({ username });
      
      if (!user) {
        console.log(`User ${username} not found, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      
      await User.updateOne(
        { username },
        { 
          $set: { 
            password: hashedPassword,
            contributionScore: 3.0,
            totalRatings: 0
          }
        }
      );
      
      console.log(`Updated user: ${username}`);
    }

    console.log('Update completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

updateUsers();
