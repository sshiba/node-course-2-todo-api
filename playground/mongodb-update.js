// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server.');
    }

    console.log('Connected to MongoDB server.');
    var db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5a9747ea236e3c9c9ae4af20")
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(JSON.stringify(result, undefined, 2));
    // });

    db.collection('Users').findOneAndUpdate({ _id: new ObjectID("5a973abf236e3c9c9ae4a995") }, {
            $set: { name: 'Sidney' },
            $inc: { age: +1 }
        }, { returnOriginal: false })
        .then((result) => {
            console.log(JSON.stringify(result, undefined, 2));
        });
    // client.close();
});