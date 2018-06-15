const express = require('express');
const router = express.Router();

const { User } = require('./models/user');

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

module.exports = router;