const mongoose = require('mongoose');



const MoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  moodScore: { type: Number, required: true, min: 1, max: 10 },
  feelingType: { 
    type: String, 
    required: true, 
    enum: ['стрес', 'заплутаність', 'піднесено', 'спокій', 'втома', 'радість', 'тривога'] 
  },
  comment: { type: String }
});

module.exports = mongoose.model('Mood', MoodSchema);