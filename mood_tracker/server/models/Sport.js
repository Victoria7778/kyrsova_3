const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, required: true }, 
  duration: { type: Number } 
});

module.exports = mongoose.model('Sport', SportSchema);