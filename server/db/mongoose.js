const mongoose = require('mongoose');

// Connect to database and made it able to use promises (for readability)
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}