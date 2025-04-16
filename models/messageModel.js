const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: {
    _id: { type: String, required: true },
    username: { type: String, required: true },
  },
  channel: { type: String, required: true },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
