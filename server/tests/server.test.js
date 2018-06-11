const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

// Array of todos to test against
const todos = [{
  _id: new ObjectID(),
  text: 'first todo'
}, {
  _id: new ObjectID(),
  text: 'second todo'
}, {
  _id: new ObjectID(),
  text: 'third todo'
}];

// Deletes db and adds the todos up above to db for
// consistent and accurate testing
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());  
});

describe('POST /Todos', () => {

  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(4);
          expect(todos[3].text).toBe(text);
          done();
        }).catch(err => done(err));
      });

  });

  it('should not create a todo', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(3);
          done();
        }).catch(err => done(err));
      });

  });

});

describe('GET /todos', () => {

  it('should get all todos', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);

  });

});

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
      
  });

  it('should return 404 if todo is not found', (done) => {

    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);

  });

  it('should return 404 if it is an invalid id', (done) => {
  
    request(app)
      .get('/todos/69348')
      .expect(404)
      .end(done);

  });
  
});

describe('DELETE /todos/:id', () => {

  it('should delete a todo and return it', (done) => {

    const deletedID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${deletedID}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(deletedID)
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(deletedID).then(todo => {
          expect(todo).toBeNull();
          done();
        }).catch(err => {
          done(err);
        });

      });

  });

  it('should return 404 for invalid ID', (done) => {

    request(app)
      .delete(`/todo/12345`)
      .expect(404)
      .end(done);

  });

  it('should return a 404 for a todo that does not exist', (done) => {

    const anID = new ObjectID().toHexString();

    request(app)
      .delete(`/todo/${anID}`)
      .expect(404)
      .end(done);

  });

});
