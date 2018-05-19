const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(PORT, () => {
  console.log('Started on port: ', PORT);
});

module.exports = {app};
