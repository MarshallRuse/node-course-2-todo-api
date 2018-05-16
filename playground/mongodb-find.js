// const MongoClient = require('mongodb').MongoClient;
  // Using ES6 Object destructuring, grabs the MongoClient property
  // off the object returned by require.  This allows multiple properties
  // to be pulled in specifically
  // The ObjectID is another property to pull out of mongodb
const {MongoClient, ObjectID} = require('mongodb');


//NOTE: TodoApp didnt exist beforehand, mongodb allows you
// to create a db on the fly, versus having to create befroehand
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err){
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // Using .find() with no arguments returns everything, equivalent to
  // SELECT *
  // find() returns a cursor to the collection, not the collection itself
  // this cursor has a bunch of associated functions, such as .toArray(),
  // .toArray() returns a Promise, so .then() can be used on it
  db.collection('Todos').find().toArray().then((docs) => {
    console.log('Todos');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    if (err){
      console.log("Unable to fetch documents", err);
    }
  });

  // And using one argument to select only certain documents
  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log("Filtered Todos");
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("Unable to fetch documents", err);
  });

  // And find by ObjectID by using the constructor for ObjectID (since
  // the data type in the db is ObjectID, not just string)
  db.collection('Todos').find({
    _id: new ObjectID("5afc7fd1f05d5007aa86a118")
  }).toArray().then((docs) => {
    console.log("Todos by ID");
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log("Unable to fetch documents", err);
  });

  // Can find the number of items in a collection
  // you can use a callback or Promise with this function, here we use Promise
  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log("Unable to fetch documents count", err);
  });
  //db.close();
});
