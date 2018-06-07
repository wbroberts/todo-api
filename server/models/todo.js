const mongoose = require('mongoose');

// The todo model
const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: [true, 'Why don\'t you have anything to do?'],
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {
  Todo
}