const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

// Add a new user to the db
router.post('/', (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      const { email, _id } = user;
      res.status(201).set('x-auth', token).json({
        _id, email
      });
    })
    .catch(err => {
      res.status(400).json({
        error: err
      });
    });

});

router.post('/login', (req, res) => {
  const {email, password} = req.body;

 User.findByCredentials(email, password)
  .then(user => {
    const {_id, email} = user;

    user.generateAuthToken()
      .then(token => {
        res.status(200).header('x-auth', token).json({_id, email});
      });
  })
  .catch(error => {
    res.status(404).json({
      error
    });
  });
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

module.exports = router;