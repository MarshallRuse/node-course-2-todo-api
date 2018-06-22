const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'marshall@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}]

const todos = [{
  _id: new ObjectID(),
  text: "First thing to do"
}, {
  _id: new ObjectID(),
  text: "Second thing to do",
  completed: true
},
{
  _id: new ObjectID(),
  text: "Heres a third thing for you",
  completed: true
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    // compare to Todo.insertMany
    // using User constructor by contrast ensures that the middleware
    // hasing the passwords is executed
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    // Promise.all waits for all Promises in the array of Promises
    // to complete before executing - in this case waiting for all to save to db
    // returning it so that the then() can be attached at the very end
    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
