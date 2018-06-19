const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../api/models/todo');
const { User } = require('./../../api/models/user');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [{
  _id: user1ID,
  email: 'fake@email.com',
  password: 'fakepassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1ID, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: user2ID,
  email: 'fakeMaeve@fake.com',
  password: 'user2fake',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: user2ID, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(res => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

// Array of todos to test against
const todos = [{
  _id: new ObjectID(),
  text: 'first todo',
  completed: false,
  completedAt: null,
  creator_id: users[0]._id
}, {
  _id: new ObjectID(),
  text: 'second todo',
  completed: true,
  completedAt: 4564,
  creator_id: users[0]._id
}, {
  _id: new ObjectID(),
  text: 'third todo',
  completed: false,
  completedAt: null,
  creator_id: users[1]._id
}]

// Deletes db and adds the todos up above to db for
// consistent and accurate testing
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

  module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
  }