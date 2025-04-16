const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  checklistId: { type: String, ref: 'boatCheckList', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  week: { type: String, required: true },
  responses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'boatCheckList.questions', required: true },
      answer: { type: mongoose.Schema.Types.Mixed, default: null },
      status: { type: String, enum: ['checked', 'unchecked'], default: 'unchecked' },
      questionType: { type: String, enum: ['1', '2', '3','4','5','6'], required: true }, // Eklenen alan
    },
  ],
  createdAt: { type: Date, default: Date.now },
 
});

module.exports = mongoose.model('Response', responseSchema);
