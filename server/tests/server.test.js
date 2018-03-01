const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    text: 'First thing to do'
}, {
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