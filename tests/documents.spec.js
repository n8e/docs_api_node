var url = 'http://localhost:3000',
  request = require('superagent'),
  user = {
    username: 'smalik',
    password: '12345'
  },
  authToken,
  userId,
  document1 = {
    title: 'Area of Triangle',
    content: 'This is obtained from the base and height. Get half of' +
      ' the base and multiply by the height to get the area.'
  },
  admin = {
    username: 'Sonnie',
    password: '12345',
    firstname: 'Sonia',
    lastname: 'Granger',
    email: 'sgranger@gmail.com',
    role: 1
  },
  document2 = {
    title: 'Perimeter of Rectangle',
    content: 'Obtained by summing the length and width and doubling the result.'
  };

describe('Document', function() {
  it('validates that one has to be authenticated to access documents (GET /api/documents)', function(done) {
    request
      .get(url + '/api/documents')
      .end(function(err, res) {
        expect(403, done);
        expect('Content-Type', 'json', done);
        expect(typeof res.body).toBe('object');
        expect(res.body.success).toEqual(false);
        expect({
          message: 'No token provided!'
        }, done);
        done();
      });
  });
});
describe('Document tests requiring authentication', function() {
  // perform login function first
  beforeEach(function login(done) {
    request
      .post(url + '/api/users/login')
      .send(user)
      .end(function(err, res) {
        if (!err) {
          userId = res.body.id;
          authToken = res.body.token;
          done();
        } else {
          console.log('There was a problem logging you in.\n' + '\n' + res.body.message);
          done();
        }
      });
  });
  it('validates that a document is created by a user logged in (POST /api/documents)', function(done) {
    request
      .post(url + '/api/documents')
      .set('x-access-token', authToken)
      .send(document1)
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
            message: 'Document has been created!'
          }, done);
          done();
        }
      });
  });
  it('validates that one has to be authenticated to access documents (GET /api/documents)', function(done) {
    request
      .get(url + '/api/documents')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        expect(200, done);
        expect('Content-Type', 'json', done);
        expect(typeof res.body).toBe('object');
        expect(res.body.length).toBeDefined();
        expect(res.body.length).not.toBeNull();
        expect(res.body.length > 0).toBeTruthy();
        expect(res.body[res.body.length - 1].title).toEqual(document1.title);
        expect(res.body[res.body.length - 1].content).toEqual(document1.content);
        done();
      });
  });

  it('validates that all documents, limited by a specified number and ordered by published date, ' +
    'that can be accessed by a role USER, are returned when getAllDocumentsByRoleUser is called',
    function(done) {
      request
        .get(url + '/api/documents/user')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(res.body[res.body.length - 1].dateCreated < res.body[0].dateCreated).toBeTruthy();
          expect(true).toBe(true);
          done();
        });
    });

  it('validates that all documents, limited by a specified number, that were' +
    ' published on a certain date, are returned when getAllDocumentsByDate is called',
    function(done) {
      request
        .get(url + '/api/documents/date')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          if (err) {
            console.log(err);
          } else {
            expect(200, done);
            expect('Content-Type', 'json', done);
            expect(res.body.length >= 1).toBeTruthy();
            expect(res.body[0].dateCreated).toContain('2015-12-03');
            expect(true).toBe(true);
            done();
          }
        });
    });
});

// tests for administrator documents
describe('Administrator Documents', function() {
  beforeEach(function logout(done) {
    request
      .get('http://localhost:3000/api/users/logout')
      .set('x-access-token', authToken)
      .end(function(err, res) {
        if (!err) {
          authToken = '';
          done();
        } else {
          console.log('Error' + res.body.message);
          done();
        }
      });
  });
  beforeEach(function createAdmin(done) {
    request
      .post(url + '/api/users')
      .send(admin)
      .end(function(err, res) {
        if (!err) {
          done();
        } else {
          console.log('There was a problem creating admin.\n' + '\n' + res.body.message);
          done();
        }
      });
  });
  beforeEach(function loginAdmin(done) {
    request
      .post(url + '/api/users/login')
      .send({
        username: 'Sonnie',
        password: '12345'
      })
      .end(function(err, res) {
        if (!err) {
          userId = res.body.id;
          authToken = res.body.token;
          done();
        } else {
          console.log('There was a problem logging you in.\n' + '\n' + res.body.message);
          done();
        }
      });
  });

  beforeEach(function postDoc(done) {
    request
      .post(url + '/api/documents')
      .set('x-access-token', authToken)
      .send(document2)
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          done();
        }
      });
  });

  it('validates that all documents, limited by a specified number and ordered by published date, ' +
    'that can be accessed by a role ADMINISTRATOR, are returned when getAllDocumentsByRoleAdmisniatrator is called',
    function(done) {
      request
        .get(url + '/api/documents/admin')
        .set('x-access-token', authToken)
        .end(function(err, res) {
          if (err) {
            return err;
          } else {
            expect(200, done);
            expect('Content-Type', 'json', done);
            expect(res.body[res.body.length - 1].title).toEqual(document2.title);
            expect(res.body[res.body.length - 1].dateCreated < res.body[0].dateCreated).toBeTruthy();
            expect(true).toBe(true);
            done();
          }
        });
    });


});
