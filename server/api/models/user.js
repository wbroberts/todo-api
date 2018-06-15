const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

userSchema.statics.findByToken = function(token) {

  let decoded;

  try {
    decoded = jwt.verify(token, '123abc');
  } catch (e) {
    return Promise.reject();
  }

  return this.findOne({
    '_id': decoded._id,
    // Quotes are required when using a period to access
    // property keys/values
    'tokens.token': token,
    'tokens.access': 'auth'
  }).then(user => {
    const {email, _id} = user;
    return {_id, email};
  })
}

userSchema.pre('save', function(next) {
  
  if (this.isModified('password')) {
    // This is the hashing algorithm for passwords
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(this.password, salt, (error, hash) => {
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User
}