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

  // find one and update, returns the updated document
  // Note the use of special update operators used to perform specific
  // actions, such as incrementation or in our case, setting a field
  // Update Operator Documentation: https://docs.mongodb.com/manual/reference/operator/update/
  // setting the optional 3rd paramter, returnOriginal to false, has it return
  // the updated document
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5afc7fd1f05d5007aa86a118")
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID("5afb38bb6bf72a69a8ed56a7")
  }, {
    $set: {
      name: "Marshy 2"
    },
    $inc: {
      age: 2
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })

  //db.close();
});
