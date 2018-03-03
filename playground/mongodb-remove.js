const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Find one document and remove it
Todo.findOneAndRemove({ _id: '5a99edd52d2aac8bf6116c9e' }).then((todo) => {
    console.log(todo);
});

// Find one document by id and remove it
Todo.findByIdAndRemove('5a99edd52d2aac8bf6116c9f').then((todo) => {
    console.log(todo);
});

// Remove all documents
Todo.remove({}).then((res) => {
    console.log(res);
});