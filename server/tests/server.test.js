const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../api/models/todo');
const { User } = require('./../api/models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /Todos', () => {

  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(201)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);

  });

});

describe('GET /todos/:id', () => {

  it('should return todo doc', (done) => {
    
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
      
  });

  it('should NOT return todo doc created by another user', (done) => {

    request(app)
      .get(`/todos/${todos[2]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

  it('should return 404 if todo is not found', (done) => {

    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

  it('should return 404 if it is an invalid id', (done) => {
  
    request(app)
      .get('/todos/69348')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

});

describe('DELETE /todos/:id', () => {

  it('should delete a todo and return it', (done) => {

    const deletedID = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${deletedID}`)
      .set('x-auth', users[0].tokens[0].token)
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

  it('should NOT delete a todo that was made by another user', (done) => {

    const deletedID = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${deletedID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(deletedID).then(todo => {
          expect(todo.text).toBe(todos[1].text);
          done();
        }).catch(err => {
          done(err);
        });

      });

  });

  it('should return 404 for invalid ID', (done) => {

    request(app)
      .delete(`/todo/12345`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

  it('should return a 404 for a todo that does not exist', (done) => {

    const anID = new ObjectID().toHexString();

    request(app)
      .delete(`/todo/${anID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);

  });

});

describe('PATCH /todos/:id', () => {

  it('should update the todo', (done) => {

    const todoID = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${todoID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: 'this is updated'
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).not.toBe(todos[0].text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
        expect(res.body.todo.creator_id).toBe(users[0]._id.toHexString());
      })
      .end(done);
  });

  it('should NOT update the todo that is another user\'s', (done) => {

    const todoID = todos[2]._id.toHexString();

    request(app)
      .patch(`/todos/${todoID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text: 'this is updated'
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        Todo.findById(todos[2]._id).then(result => {
          expect(result.completed).toBe(false);
          done();
        }).catch(error => {
          done(error);
        });
      });
  });

  it('should toggle completed value and clear completedAt', (done) => {

    const todoID = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${todoID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.creator_id).toBe(users[0]._id.toHexString());
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeNull();
      })
      .end(done);

  });

});

// BEGIN TESTING FOR USERS //

describe('GET /users/me', () => {

  it('should return user if authenticated', (done) => {

    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);

  });

  it('should return a 401 if not authenticated', (done) => {

    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);

  });

});

describe('POST /users', () => {

  it('should create a new user', (done) => {
    const email = 'willbb@example.com';
    const password = 'password!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(201)
      .expect(res => {
        expect(res.headers['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end(error => {
        if (error) {
          return done(error);
        }

        User.findOne({email}).then(res => {
          expect(res._id).toBeDefined();
          expect(res.email).toBe(email);
          expect(res.password).not.toBe(password);
          done();
        }).catch(error => {
          done(error);
        });
      });

  });

  it('should return 400 because of an invalid email', (done) => {

    request(app)
      .post('/users')
      .send({
        email: 'will@exa',
        password: 'password'
      })
      .expect(400)
      .end(done);

  });

  it('should not create a user if the email is already in use', (done) => {

    request(app)
      .post('/users')
      .send({
        email: 'fake@email.com', 
        password: 'password'
      })
      .expect(400)
      .end(done);

  });

});

describe('POST /users/login', () => {

  it('should login user and return a token', (done) => {

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch(error => {
          done(error);
        });

      });

  });

  it('should return 404 when credentials do not match', (done) => {

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'badpassword'
      })
      .expect(404)
      .expect(res => {
        expect(res.headers['x-auth']).toBeUndefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch(error => {
          done(error);
        });

      });

  });
});

describe('DELETE /users/me/token', () => {

  it('should remove auth token when logged out', (done) => {

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[0]._id).then(res => {
            expect(res.tokens.length).toBe(0);
            done();
          }).catch(error => {
            done(error);
          });
      });

  });

});