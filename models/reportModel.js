const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  region: { type: String, required: true },
  checklistId: { type: String }, // Opsiyonel alan
  materials:{type:String},
  createdAt: { type: Date, default: Date.now },
  component:{type:String},
  status: { type: String, default: 'pending', enum: ['pending', 'process', 'rejected'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Report', reportSchema);
