const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
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
  },
  creator_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = {
  Todo
}