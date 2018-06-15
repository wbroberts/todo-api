const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    minLength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = function() {
  
  const access = 'auth';
  const token = jwt.sign({_id: this._id.toHexString(), access}, '123abc').toString();

  this.tokens = this.tokens.concat([{access, token}]);

  return this.save()
    .then(() => {
      return token;
    }).catch(error => {
      console.log(error);
    });
}

const User = mongoose.model('User', userSchema);

module.exports = {
  User
}