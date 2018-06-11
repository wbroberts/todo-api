const mongoose = require('mongoose');

// Connect to database and made it able to use promises (for readability)
mongoose.Promise = global.Promise;

// Connects to either the heroku mongodb (if online) or the local server's mongodb
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}