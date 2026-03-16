const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'навчання',    
      'робота',       
      'відпочинок',   
      'спорт',        
      'хобі',          
      'соціалізація', 
      'здоров\'я',     
      'побутові справи',        
      'подорожі',      
      'інше'         
    ],
    default: 'інше'
  },
  description: { type: String }
});

module.exports = mongoose.model('Event', EventSchema);