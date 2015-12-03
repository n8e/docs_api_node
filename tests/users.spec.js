var url = 'http://localhost:3000',
  request = require('superagent');

var user = {
    firstname: 'Sadiq',
    lastname: 'Malika',
    password: '12345',
    email: 'smalik@gmail.com',
    username: 'smalik',
    role: 2
  };

var sameUser = {
  firstname: 'Sadiq',
  lastname: 'Malika',
  password: '12345',
  email: 'smalik@gmail.com',
  username: 'smalik',
  role: 2
};


describe('Users', function() {
  it('should show that a new user is created (POST /api/users)', function(done) {
    request
      .post(url + '/api/users')
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
      .post(url + '/api/users')
      .send(sameUser)
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(typeof res.body).toBe('object');
          expect({
            code: 11000,
            index: 0
          }, done);
          done();
        }
      });
  });
  it('validates that all users are returned when getAllUsers ' + 
    'function in the controller is called (GET /api/users)', function(done) {
    request
      .get(url + '/api/users')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(res.body.length).toBeDefined();
          expect(res.body.length).not.toBeNull();
          expect(res.body.length > 0).toBeTruthy();
          expect(res.body[res.body.length - 1].username).toEqual('Sonnie');
          expect(res.body[res.body.length - 1].email).toEqual('sgranger@gmail.com');
          expect(typeof res.body).toBe('object');
          done();
        }
      });
  });
  it('validates that the new user created has a defined role, has a first name and a last name', function(done) {
    request
      .get(url + '/api/users')
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(res.body[res.body.length - 1].role).toEqual('Administrator');
          expect(res.body[res.body.length - 1].name.first).toEqual('Sonia');
          expect(res.body[res.body.length - 1].name.last).toEqual('Granger');
          done();
        }
      });
  });
});
