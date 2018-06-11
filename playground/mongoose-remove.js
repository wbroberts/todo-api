const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.findByIdAndRemove('5b1e8ca94f08bd0672eb2b0e').then(todo => {
//   console.log(todo);
// });

Todo.findByIdAndUpdate("5b1e8d57661ff50680f37ccc").then(todo => {
  todo.completed = true;
  console.log(todo);
})