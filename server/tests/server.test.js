const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

// Clean up the Todo collection then create two documents for testing purposes
beforeEach(populateUsers);
beforeEach(populateTodos);

// Testing ADD REST API (POST /todos): successful use case and failure use case
describe('POST /todos', () => {
    // Testing sucess (200) POST /todos use case
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    // Testing failure (400) POST /todos use case
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            })
    });
});

// Testing GET /todos REST API
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});

// Testing GET /todos/:id REST API with valid document
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

    // Testing GET /posts/<id> with valid ID but no document associated with ID
    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            // .expect((res) => {
            //     expect(res.body.todo).toBe(undefined);
            // })
            .end(done);
    });

    // Testing GET /posts/<id> with invalid ID
    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            // .expect((res) => {
            //     expect(res.body.todo).toBe(undefined);
            // })
            .end(done);
    });
});

// Testing cases for DELETE /todos/:id
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                };

                Todo.findById(hexID).then((todo) => {
                    console.log(`Searching for removed todo document: todo = ${todo}`);
                    expect(todo).toEqual(null);
                    done();
                }).catch((err) => done(err));
            });
    });

    // Testing GET /posts/<id> with valid ID but no document associated with ID
    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            // .expect((res) => {
            //     expect(res.body.todo).toBe(undefined);
            // })
            .end(done);
    });

    // Testing GET /posts/<id> with invalid ID
    it('should return 404 for non-object ids', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            // .expect((res) => {
            //     expect(res.body.todo).toBe(undefined);
            // })
            .end(done);
    });
});

// Testing cases for PATCH /todos/:id
describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        var hexID = todos[0]._id.toHexString();
        var text = 'This task has been completed'

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completeAt).toBe('number');
            })
            .end(done);
    });

    it('should update a todo', (done) => {
        var hexID = todos[1]._id.toHexString();
        var text = 'This task has been completed !!'

        request(app)
            .patch(`/todos/${hexID}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completeAt).toBe(null);
            })
            .end(done);
    });

    // Testing GET /posts/<id> with valid ID but no document associated with ID
    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app)
            .patch(`/todos/${id}`)
            .send({})
            .expect(404)
            .end(done);
    });

    // // Testing GET /posts/<id> with invalid ID
    it('should return 404 for non-object ids', (done) => {
        request(app)
            .patch('/todos/123')
            .send({})
            .expect(404)
            .end(done);
    });
});

// Testing GET /users/me
describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

// Testing POST /users
describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'sidney.shiba@example.com'
        var password = 'abcmnd'

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(typeof res.headers['x-auth']).toBe('string');
                expect(typeof res.body._id).toBe('string');
                expect(res.body.email).toBe(email);
            })
            .end((err) => { //custom error function processing
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                    expect(typeof user).toBe('object');
                    expect(user.password).not.toBe(password);
                    done();
                })
            });
    });

    it('should return error if invalid request', (done) => {
        var invalidEmail = 'sidney.example.com';
        var invalidPassword = '12345';

        request(app)
            .post('/users')
            .send({ invalidEmail, invalidPassword })
            .expect(400)
            .end(done);
    });

    it('should not create user if email already in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'password'
            })
            .expect(400)
            .end(done);
    });
});