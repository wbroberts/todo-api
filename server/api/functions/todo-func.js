const { ObjectID } = require('mongodb');

const {Todo} = require('../models/todo');

exports.getTodos = (req, res) => {
  Todo.find({ creator_id: req.user._id })
    .then(todos => {
      res.status(200).json({ todos });
    })
    .catch(error => {
      res.status(404).json({ error });
    });
}

exports.createTodo = (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    creator_id: req.user._id
  });

  todo.save()
    .then(result => {
      const { text, completed } = result;

      res.status(201).json({
        todo: { text, completed }
      });
    })
    .catch(error => {
      res.status(400).json({ error });
    });
}

exports.getOneTodo = (req, res) => {
  const todoId = req.params.id;

  if (!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  Todo.findOne({ _id: todoId, creator_id: req.user._id })
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }

      res.status(200).json({ todo: result });
    })
    .catch(() => {
      res.status(400).send();
    });
}

exports.updateTodo = (req, res) => {
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

  Todo.findOneAndUpdate({ _id: todoId, creator_id: req.user._id }, {
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
}

exports.removeTodo = (req, res) => {
  const todoId = req.params.id;

  if (!ObjectID.isValid(todoId)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({ _id: todoId, creator_id: req.user._id })
    .then(result => {
      if (!result) {
        return res.status(404).send();
      }

      res.status(200).json({ todo: result });
    })
    .catch(e => {
      res.status(400).send();
    });
}

module.exports = exports;