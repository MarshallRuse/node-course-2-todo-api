const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
// Mongoose has a model feature, which gives more structure to the
// default freeform mongo collections.  Setting up the model allows you
// to define certain features for each collection.  Acts like a Class
// They can be found in the server/models folder
const {Todo} = require('./models/todo.js');
const {User} = require('./models/users.js');

const app = express();

const PORT = process.env.PORT || 3000;

// middle-ware
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});


// Using colon, :, before a variable such as id is how parameters are passed
// using http.  The parameter gets attached as a key-value pair
// on the req.params object
app.get('/todos/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (todo){
      res.send({todo});
    }
    else{
      res.status(404).send();
    }

  }).catch((e) => {
    res.status(400).send();
  });

});

app.delete('/todos/:id', (req, res) => {
  // get the id
  let id = req.params.id;

  // validate the id -> not valid? return 404
  if (ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //remove todo by id
  Todo.findByIdAndRemove(id).then((doc) => {
    //success
      // if no doc, send 404
      // if doc, send doc back with 200
    if (doc) {
      res.send(doc);
    }
    else {
      res.status(404).send();
    }
  }).catch((e) => {
    res.status(400).send();
  });


});

app.listen(PORT, () => {
  console.log('Started on port: ', PORT);
});

module.exports = {app};
