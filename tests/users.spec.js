const expect = require('chai').expect;
const request = require('superagent');
const url = 'http://localhost:3000';

describe('Users', () => {
  it('should show that a new user is created (POST /api/users)', (done) => {
    request
      .post(url + '/api/users')
      .set('Content-Type', 'application/json')
      .send({
        username: 'batman',
        firstname: 'Bruce',
        lastname: 'Wayne',
        email: 'batman@cave.com',
        password: '12345',
        role: 'User',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('User has been created!');
        done();
      });
  });

  it('validates that only valid user roles can be assigned to a user', (done) => {
    request
      .post(url + '/api/users')
      .set('Content-Type', 'application/json')
      .send({
        username: 'batman',
        firstname: 'Bruce',
        lastname: 'Wayne',
        email: 'batman@cave.com',
        password: '12345',
        role: 'Developer',
      })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.name).to.equal('ValidationError');
        expect(res.body.message).to.equal(
          'User validation failed: role: `Developer` is not a valid enum value for path `role`.',
        );
        done();
      });
  });

  it('validates that all users are returned when getAllUsers function in the controller is called (GET /api/users)', (done) => {
    request
      .get(url + '/api/users')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.be.above(0);
        expect(res.body[res.body.length - 1].username).to.equal('batman');
        expect(res.body[res.body.length - 1].email).to.equal('batman@cave.com');
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('validates that the new user created has a defined role, has a first name and a last name', (done) => {
    request.get(url + '/api/users').end((err, res) => {
      expect(res.status).to.equal(200);
      expect(res.body[res.body.length - 1].role).to.equal('User');
      expect(res.body[res.body.length - 1].firstname).to.equal('Bruce');
      expect(res.body[res.body.length - 1].lastname).to.equal('Wayne');
      done();
    });
  });

  it('validates that a valid user can be logged in', (done) => {
    request
      .post(url + '/api/users/login')
      .send({ username: 'smalik', password: '12345' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Successfully logged in!');
        expect(res.body.token).not.to.be.undefined;
        done();
      });
  });

  it('validates that an invalid user cannot be logged in', (done) => {
    request
      .post(url + '/api/users/login')
      .send({ username: 'rupertm', password: '67891' })
      .end((err, res) => {
        expect(res.status).to.equal(500);
        expect(res.body.message).to.equal("User doesn't exist");
        done();
      });
  });
});
