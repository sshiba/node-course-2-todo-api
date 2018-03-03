const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First thing to do'
}, {
    _id: new ObjectID(),
    text: 'Second thing to do'
}];

// Clean up the Todo collection then create two documents for testing purposes
beforeEach((done) => {
    // Removing all documents from Todo collection
    Todo.remove({}).then(() => {
        // Inserting two new documents
        return Todo.insertMany(todos);
    }).then(done());
});

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
        })
        // it('should remove a todo', (done) => {

    // });

    // it('should return 404 if object id is invalid', (done) => {

    // });
});