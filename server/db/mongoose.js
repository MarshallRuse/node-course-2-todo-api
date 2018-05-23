const mongoose = require('mongoose');

// tells mongoose to use JS Promises, only need to set once in this root file
mongoose.Promise = global.Promise;
// with mongoose, use mongoose to connect rather than MongoClient,
// but same parameters passed
// however, behind the scenes mongoose is more complex, handles and maintains
// connection, as well as timing events to wait for a connection establishment
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
