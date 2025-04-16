const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  type: { type: String, enum: ['approval', 'note', 'signature'], required: true },
  isChecked: { 
    type: Boolean, 
    default: false,
    required: function() { return this.type === 'note'; } 
  },
  signature: { 
    type: String, 
    default: 'Imza Atılmadı',
    required: function() { return this.type === 'signature'; }
  },
  questionType:{  type: String, enum: ['1', '2','3','4','5','6'], required: true },
  region: { type: String, required: false },

});

const checklistSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('boatCheckList', checklistSchema);
