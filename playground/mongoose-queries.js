const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

const id = '5b0349a76e7130d3ceb72d85';

if (!ObjectID.isValid(id)){
  console.log('ID not valid');
}

// Mongoose automatically wraps the String id var in a ObjectID constructor
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});


Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  if (!todo){
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
}).catch((e) => console.log(e));
