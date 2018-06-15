const express = require('express');
const router = express.Router();

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
      res.set('x-auth', token).json({
        email, _id
      });
    })
    .catch(err => {
      res.status(400).json({
        error: err
      });
    });

});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

module.exports = router;