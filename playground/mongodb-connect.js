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

  // The Todos collection was created on the fly as well
  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err){
  //     console.log("Unable to insert into collection", err);
  //   }
  //   else {
  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //   }
  // })

  db.collection('Users').insertOne({
    name: "Marshall",
    age: 25,
    location: "No"
  }, (err, result) => {
    if (err){
      console.log("Unable to insert into collection", err);
    }
    else{
      console.log(JSON.stringify(result.ops, undefined, 2));
      // Because the time the document was created at is embedded
      // in the objectID
      console.log("Timestamp: ", result.ops[0]._id.getTimestamp());
    }
  });

  db.close();
});
