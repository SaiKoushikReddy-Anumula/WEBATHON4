const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Hackathon', 'Research', 'Startup', 'Academic', 'Other'], required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostRole: { type: String, default: 'Project Lead' },
  
  teamSize: { type: Number, required: true },
  requiredRoles: [{
    role: { type: String, required: true },
    count: { type: Number, default: 1 },
    filled: { type: Number, default: 0 }
  }],
  requiredSkills: [{
    skill: { type: String, required: true },
    minProficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true }
  }],
  
  deadline: { type: Date, required: true },
  weeklyCommitment: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed', 'Terminated'], default: 'Open' },
  deletedAt: { type: Date, default: null },
  
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  memberRatings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 }
  }],
  invitations: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    sentAt: { type: Date, default: Date.now }
  }],
  applications: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    appliedAt: { type: Date, default: Date.now }
  }],
  
  workspace: {
    threads: [{
      name: String,
      messages: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        timestamp: { type: Date, default: Date.now }
      }]
    }],
    tasks: [{
      title: String,
      description: String,
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
      createdAt: { type: Date, default: Date.now }
    }],
    files: [{
      name: String,
      url: String,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: { type: Date, default: Date.now }
    }],
    activityLog: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      action: String,
      timestamp: { type: Date, default: Date.now }
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
