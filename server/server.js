var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

// Creating the Todo model
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completeAt: {
        type: Number,
        default: null
    }
});

// Creating a todo document
// var newTodo = new Todo({
//     text: 'Edit this video'
// });

// // Committing the document to the database
// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (err) => {
//     console.log('Unable to save todo', err);
// });

var User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    }
});

var newUser = new User({
    name: 'Anne Marie',
    email: 'amshiba@gmail.com'
});

newUser.save().then((user) => {
    console.log('Saved user', user);
}, (err) => {
    console.log('Unable to save user', err);
});