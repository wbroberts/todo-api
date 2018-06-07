const mongoose = require('mongoose');

// User model
const User = mongoose.model('User', {
  email: {
    type: String,
    required: [true, 'Can\'t be a user without an email!'],
    minlength: 1,
    trim: true
  }
});

module.exports = {
  User
}