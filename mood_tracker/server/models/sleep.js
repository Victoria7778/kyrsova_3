const mongoose = require('mongoose');

const SleepSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Формат "YYYY-MM-DD" для унікальності за день
  hours: { type: Number, required: true },
  quality: { type: String, enum: ['good', 'fair', 'bad'] }
});

// Робимо так, щоб користувач міг додати лише один запис сну на одну дату
SleepSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Sleep', SleepSchema);