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

  // delete Many

    // db.collection('Todos').deleteMany({text: "Go to the gym"}).then((result) => {
    //   console.log(result);
    // });

  // delete one

    // db.collection('Todos').deleteOne({text: "Go to the gym"}).then((result) => {
    //   console.log(result);
    // });

  // find one and delete - return data first then delete

  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({name: "John"}).then((result) => {
    console.log(result);
  });

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID("5afcad2af05d5007aa86a69f")
  }).then((result) => {
    console.log(result);
  });

  //db.close();
});
