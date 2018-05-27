const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

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

// for toBe(3) below to be valid, clear database
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});


describe('POST /todos', () => {
  //asynchronous, specify done
  it('should create a new todo', (done) => {
    let text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
    })
  });

  it('should not post an empty body', (done) => {
    let text = "";

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if (err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return a valid todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return a 404 for an invalid ID', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });

  it('should return a 404 for a non-existent Todo', (done) => {
    let id = todos[0]._id.toHexString();
    let wrongID = new ObjectID();

    request(app)
      .get(`/todos/${wrongID}`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo', (done) => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err){
          return done(err);
        }
        Todo.findById(hexId).then((res) => {
          expect(res).toNotExist();
          done();
        }).catch((e) => {
          done(e);
        });
      })

  });

  it('should return a 404 if todo not found', (done) => {
    let wrongID = new ObjectID();

    request(app)
      .get(`/todos/${wrongID}`)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if ID not valid', (done) => {
      request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
  });
});

describe('PATCH todos/:id', () => {
  it('should update the todo', (done) => {
    //grab id of first item
    let id = todos[0]._id.toHexString();
    console.log("id: ", id);
    // update text, set completed true

    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: "Some new text",
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe("Some new text");
        console.log("res completed: ", res.body.todo.completed);
        console.log("res text: ", res.body.todo.text);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  });

  it('should clear completedAt when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString();


    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: "Something Im not to do",
        completed: false
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

});
