const express = require('express');
const router = express.Router();

const { User } = require('./models/user');

router.post('/', (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save()
    .then(result => {
      res.status(201).json({
        message: 'User successfully created',
        user: result
      });
    })
    .catch(err => {
      res.status(400).json({
        error: err
      });
    });

});

module.exports = router;