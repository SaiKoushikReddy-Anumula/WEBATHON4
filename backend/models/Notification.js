const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['application', 'selection', 'project_update', 'workspace_activity', 'interview', 'invitation', 'invitation_response'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  read: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
