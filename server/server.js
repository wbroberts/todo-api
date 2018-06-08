const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// This is for creating todos
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then(result => {
    res.send(result);
  }, err => {
    res.status(400).send(err);
  });
});

// Adds a user to the db
app.post('/users', (req, res) => {
  const user = new User({
    email: req.body.email
  });

  // First checks if the email already exists before adding
  User.findOne({
    email: user.email
  }).then(result => {

    if (result) {
      return res.send({
        error: 'That email already exists'
      });
    }

    user.save().then(user => {
      res.send(user);
    }, e => {
      res.send(e);
    }); 

  }, e => {
    res.send(e);
  });

});

// This is receives a GET request and sends back the todos
// -- important for sending back JSON data
app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos});
  }, err => {
    res.status(400).send(err);
  });
});


// This is the actual server running
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

module.exports = {
  app
}