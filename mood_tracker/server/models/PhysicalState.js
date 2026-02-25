const mongoose = require('mongoose');

const physicalStateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  energyLevel: { type: Number, min: 1, max: 10 },
  symptoms: [{ type: String }], 
  note: { type: String }
});

module.exports = mongoose.model('PhysicalState', physicalStateSchema);