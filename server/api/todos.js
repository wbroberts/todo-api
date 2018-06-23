const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');
const helper = require('./functions/todo-func');

// This is the main route for getting all todos and creating a todo
router.all('/', authenticate);
router.route('/')
  .get(helper.getTodos)
  .post(helper.createTodo);

// Main route for all todo actions that require the ID
router.all('/:id', authenticate);
router.route('/:id')
  .get(helper.getOneTodo)
  .patch(helper.updateTodo)
  .delete(helper.removeTodo);

module.exports = router;