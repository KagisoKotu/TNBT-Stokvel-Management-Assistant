const mongoose = require('mongoose');

// This tells MongoDB exactly what information to expect from your frontend form
const agendaSchema = new mongoose.Schema({
  groupId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  agenda: { 
    type: String, 
    required: true // This will hold all that rich-text HTML from ReactQuill
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Export it so our route can use it
module.exports = mongoose.model('Agenda', agendaSchema);