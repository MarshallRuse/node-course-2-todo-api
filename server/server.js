require('./config/config');

const _ = require('lodash');
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

const {authenticate} = require('./middleware/authenticate');

const app = express();

const PORT = process.env.PORT;

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
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //remove todo by id
  Todo.findByIdAndRemove(id).then((todo) => {
    //success
      // if no doc, send 404
      // if doc, send doc back with 200
    if (!todo) {
      return res.status(404).send();
    }

    res.send(todo);
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res) => {
  let id = req.params.id;
  // lodash has a pick() method that filters certain object parameters
  // we only want users to be allowed to update 'text' and 'completed'
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  // lodash also has verification functions
  if (_.isBoolean(body.completed) && body.completed){
    // we control this param, and add it when we want to, rather than the user
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null; //remove from the database
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }
    res.send({todo});

  }).catch((e) => {
    res.status(400).send();
  });
});

// POST users
app.post('/users/', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);

  // let user = new User({
  //   email: body.email,
  //   password: body.password
  // });
  let user = new User(body);

  user.save().then(() => {
    //res.send({user});
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send();
  });
});



app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(PORT, () => {
  console.log('Started on port: ', PORT);
});

module.exports = {app};
