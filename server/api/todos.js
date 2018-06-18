const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./models/todo');

// This is receives a GET request and sends back the todos
// -- important for sending back JSON data
router.get('/', (req, res) => {
  Todo.find()
    .then(todos => {
      res.status(200).json({todos});
    })
    .catch(error => {
      res.status(404).json({error});
    });
});

// This is to GET a specific todo by its ID
router.get('/:id', (req, res) => {
  const todoId = req.params.id;

  if (!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  Todo.findById(todoId)
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }

      res.status(200).json({todo: result});
    })
    .catch(() => {
      res.status(400).send();
    });

});

// This is for creating todos
router.post('/', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save()
    .then(result => {
      const {text, completed} = result;

      res.status(201).json({
        todo: {text, completed}});
    }) 
    .catch(error => {
      res.status(400).json({error});
    });
});

// Updating the todo
router.patch('/:id', (req, res) => {
  const todoId = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(todoId, {
    $set: body
    }, {
      new: true
    })
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }

      res.status(200).json({ todo: result });
    })
    .catch(err => {
      res.status(400).send();
    });

});

// This is for removing a todo
router.delete('/:id', (req, res) => {
  const todoId = req.params.id;

  if (!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(todoId)
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }

      res.status(200).json({ todo: result });
    })
    .catch(e => {
      res.status(400).send();
    });

});

module.exports = router;