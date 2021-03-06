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
  const token = jwt.sign({_id: this._id.toHexString(), access}, process.env.JWT_SECRET).toString();

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
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

userSchema.methods.removeToken = function(token) {
  return this.update({
    $pull: {
      tokens: {token}
    }
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

userSchema.statics.findByCredentials = function(email, password) {

  return this.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject('Email or password was incorrect');
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (error, result) => {
          if (!result) {
            return reject('Email or password was incorrect');
          } else {
            return resolve(user);
          }
        });
      });    
    });
  
}


const User = mongoose.model('User', userSchema);

module.exports = {
  User
}