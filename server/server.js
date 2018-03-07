require('./config/config');

const { ObjectID } = require('mongodb');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// create a new document in MongoDB
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

// get all todos from mongoDB
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
    }).catch((err) => {
        console.log(err);
        res.status(404).send();
    });
})

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        console.log('ID not valid');
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            console.log('todo not found');
            return res.status(404).send();
        }
        console.log('Delete ID', todo);
        res.status(200).send({ todo });
    }).catch((err) => {
        console.log(err);
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        console.log('ID not valid');
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        var time = new Date().getTime();
        body.completeAt = time;
        console.log(`completed time: ${time}`);
    } else {
        body.completed = false;
        body.completeAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((err) => {
        res.status(400).send();
    });
});

// create a new user in MongoDB
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    console.log('POST /users ', body);

    user.save().then(() => {
        return user.generatAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});

module.exports = { app };