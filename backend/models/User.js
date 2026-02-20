const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  profile: {
    name: { type: String, required: true },
    branch: String,
    year: String,
    bio: String,
    skills: [{
      name: { type: String, required: true },
      proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true }
    }],
    interests: [String],
    workExperience: [{
      projectName: String,
      role: String,
      description: String,
      duration: String
    }],
    availability: { type: String, enum: ['Available', 'Limited', 'Not available'], default: 'Available' }
  },
  
  selectionFrequency: { type: Number, default: 0 },
  activeProjectCount: { type: Number, default: 0 },
  currentProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
