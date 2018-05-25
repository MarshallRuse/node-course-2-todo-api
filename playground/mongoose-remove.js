const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/users');

const id = '5b0349a76e7130d3ceb72d85';

// Todo.remove - finds and removes all that match
// to remove all, use Todo.remove({}) vs just passing empty arguments
// Dont get any docs back though

//Todo.findOneAndRemove - finds, deletes, and returns docs

// Todo.findByIdAndRemove - also returns doc after deletion
