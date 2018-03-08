const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'sidney.shiba@gmail.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'amshiba@gmail.com',
    password: 'userTwoPass'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First thing to do'
}, {
    _id: new ObjectID(),
    text: 'Second thing to do',
    completed: true,
    completeAt: 3333
}];

const populateTodos = (done) => {
    // Removing all documents from Todo collection
    Todo.remove({}).then(() => {
        // Inserting two new documents
        return Todo.insertMany(todos);
    }).then(done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        // Promise.all will wait for userOne and userTwo to be saved into the DB
        // before executing the .then() function.
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };