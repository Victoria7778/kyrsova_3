const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  title: { type: String, required: true }, 
  description: { type: String },         
  impact: { 
    type: String, 
    enum: ['позитивний', 'нейтральний', 'негативний'], 
    default: 'нейтральний' 
  }
});

module.exports = mongoose.model('Event', EventSchema);