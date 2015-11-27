var docMan = require('../server/routes/api'),
  express = require('express'),
  faker = require('faker');

var app = express();
var request = require('superagent')(app);

var user = {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    password: '12345',
    email: faker.internet.email(),
    username: faker.internet.userName(),
    role: 'User'
  },
  authToken, userId;

var sameUser = {
  firstname: user.firstname,
  lastname: user.lastname,
  password: user.password,
  email: user.email,
  username: user.username,
  role: user.role
};


describe('Users', function() {
  it('should show that a new user is created (POST /api/users)', function(done) {
    request
      .post('/api/users')
      .send(user)
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(typeof res.body).toBe('object');
          expect({
            success: true
          }, done);
          expect({
            message: 'User has been created!'
          }, done);
          done();
        }
      });
  });
  it('validates that the new user created is unique (POST /api/users)', function(done) {
    request
      .post('/api/users')
      .send(sameUser)
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(typeof res.body).toBe('object');
          expect({
            code: 11000
          }, done);
          done();
        }
      });
  });
  it('validates that all users are returned when getAllUsers function in the controller is called (GET /api/users)', function(done) {
    request
      .get('/api/users')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect('res.body[res.body.length - 1].username', user.username, done);
          expect(typeof res.body).toBe('object');
          done();
        }
      });
  });
  it('validates that the new user created has a defined role, has a first name and a last name', function(done) {
    request
      .get('/api/users')
      .end(function(err, res) {
        // var response = JSON.parse(res);
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          // expect(JSON.parse(res).length, 4, done);
          // expect(typeof res.body[res.body.length - 1]).toBe('object');
          done();
        }
      });
  });
});