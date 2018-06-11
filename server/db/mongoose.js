const mongoose = require('mongoose');

// Connect to database and made it able to use promises (for readability)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}