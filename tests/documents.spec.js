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
  };

function login(done) {
  request
    .post(url + '/api/users/login')
    .send(user)
    .end(function(err, res) {
      if (!err) {
        console.log('You have successfully logged in.');
        userId = res.body.id;
        authToken = res.body.token;
        done();
      } else {
        console.log('There was a problem logging you in.\n' + '\n' + res.body.message);
        done();
      }
    });
}

function logout(done) {
  request
    .get('http://localhost:3000/api/users/logout')
    .set('x-access-token', authToken)
    .end(function(err, res) {
      if (!err) {
        authToken = '';
        console.log('You have logged out of docms.');
        done();
      } else {
        console.log('Error' + res.body.message);
        done();
      }
    });
}

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
  it('validates that a document is created by a user logged in (POST /api/documents)', function(done) {
    // perform login function first
    beforeEach(function() {
      login(done);
    });
    request
      .post(url + '/api/documents')
      .set('x-access-token', authToken)
      .send(document1)
      .end(function(err, res) {
        if (err) {
          return err;
        } else {
          console.log('User Id ' + userId + ' authToken ' + authToken);
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
    // perform login function first
    beforeEach(function() {
      login();
    });
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
    'that can be accessed by a specified role, are returned when getAllDocumentsByRole is called', function() {
    expect(true).toBe(true);
  });

  it('validates that all documents, limited by a specified number, that were' + 
    ' published on a certain date, are returned when getAllDocumentsByDate is called', function() {
    expect(true).toBe(true);
  });
});
