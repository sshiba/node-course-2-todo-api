const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

//var id = '5a980445b9207a73f6aa9533';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }
// Todo.find({
//     _id: id
// }).then((res) => {
//     console.log('Todos', res);
// });

// Todo.findOne({
//     _id: id
// }).then((res) => {
//     console.log('Todo', res);
// });

// Todo.findById(id).then((res) => {
//     if (!res) {
//         return console.log('Id not found.')
//     }
//     console.log('Todo by ID', res);
// }).catch((e) => console.log(e));

var user_id = '5a97656fc557a85f9a7bf471';

User.findById(user_id).then((res) => {
    if (!res) {
        return console.log('Id not found');
    }
    console.log('User by ID', res);
}, (err) => {
    console.log(err);
}).catch((err) => console.log(err));