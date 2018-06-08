const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '5b1a95d5a8430c7ec978833b';

function jsonify(response) {
  return JSON.stringify(response, undefined, 2);
}

if (!ObjectID.isValid(id)) {
  return console.log('Not a valid ID');
}

User.findById(id).then(res => {
  if (!res) {
    return console.log('Did not find anything');
  }
  console.log(jsonify(res));
}).catch(e => {
  console.log(jsonify(e));
});