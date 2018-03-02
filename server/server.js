const { ObjectID } = require('mongodb');

var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });
});

// GET /todos/123234
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        console.log('ID not valid');
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (todo) {
            console.log('Todo by ID', todo);
            return res.status(200).send({ todo });
        }
        console.log('todo not found');
        res.status(404).send();
    }, (err) => {
        console.log(err);
        res.status(400).send();
    }).catch((err) => {
        console.log(err);
        return res.status(500).send();
    });
})

app.listen(3000, () => {
    console.log('Started server on port 3000');
});

module.exports = { app };