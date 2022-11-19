/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const { expect } = require('chai');
const request = require('superagent');
const moment = require('moment');

const sampleDocuments = [
  {
    title: 'Area of Triangle',
    content:
      'This is obtained from the base and height. Get half of the base and multiply by the height to get the area.',
  },
  {
    title: 'Cone',
    content:
      'Has a circular base and a pointed top. It is a third of a cylinder',
  },
  {
    title: 'Perimeter of Rectangle',
    content:
      'Obtained by summing the length and width and doubling the result.',
  },
  {
    title: 'Cylinder',
    content: 'Volume obtained using area of base multiplied by the height.',
  },
];
const url = 'http://localhost:3000';
const user = {
  username: 'smalik',
  password: '12345',
};
let authToken = '';
let doc1id = '';
let doc2id = '';

describe('Document', () => {
  it('validates that one has to be authenticated to access documents (GET /api/documents)', (done) => {
    request.get(`${url}/api/documents`).end((err, res) => {
      expect(res.status).to.equal(403);
      expect(res.body).to.be.an('object');
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('No token provided!');
      done();
    });
  });
});

describe('Document tests requiring authentication', () => {
  // perform login function first
  beforeEach((done) => {
    request
      .post(`${url}/api/users/login`)
      .send(user)
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  it('validates that a document is created by a user logged in (POST /api/documents)', (done) => {
    request
      .post(`${url}/api/documents`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .send(sampleDocuments[0])
      .end((err, res) => {
        doc1id = res.body._id;

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body._id).not.to.be.undefined;
        expect(res.body.title).to.equal(sampleDocuments[0].title);
        expect(res.body.content).to.equal(sampleDocuments[0].content);
        done();
      });
  });

  it('validates that a document is created by a user logged in (POST /api/documents)', (done) => {
    request
      .post(`${url}/api/documents`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .send(sampleDocuments[1])
      .end((err, res) => {
        doc2id = res.body._id;

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body._id).not.to.be.undefined;
        expect(res.body.title).to.equal(sampleDocuments[1].title);
        expect(res.body.content).to.equal(sampleDocuments[1].content);
        done();
      });
  });

  it('validates that one has to be authenticated to access documents (GET /api/documents)', (done) => {
    request
      .get(`${url}/api/documents`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body[res.body.length - 1].title).to.equal(
          sampleDocuments[1].title,
        );
        expect(res.body[res.body.length - 1].content).to.equal(
          sampleDocuments[1].content,
        );
        done();
      });
  });

  it('validates that all documents, limited by a specified number and ordered by published date, that can be accessed by a role USER, are returned when getAllDocumentsByRoleUser is called', (done) => {
    request
      .get(`${url}/api/documents/user`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        const itemOne = res.body[0];
        const itemLast = res.body[res.body.length - 1];

        expect(res.status).to.equal(200);
        expect(itemLast.dateCreated).to.equal(itemOne.dateCreated);
        done();
      });
  });

  it('validates that all documents, limited by a specified number, that were published on a certain date, are returned when getAllDocumentsByDate is called', (done) => {
    request
      .get(`${url}/api/documents/date`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.length).to.be.above(1);
        expect(res.body[0].dateCreated).to.contain(
          moment(new Date()).format('YYYY-MM-DD'),
        );
        done();
      });
  });
});

// tests for administrator documents
describe('Administrator Documents', () => {
  beforeEach((done) => {
    request
      .get('http://localhost:3000/api/users/logout')
      .set('x-access-token', authToken)
      .end(() => {
        authToken = '';
        done();
      });
  });

  // login the administrator
  beforeEach((done) => {
    request
      .post(`${url}/api/users/login`)
      .send({
        username: 'Sonnie',
        password: '12345',
      })
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  it('validates that a document is created by a admin logged in (POST /api/documents)', (done) => {
    request
      .post(`${url}/api/documents`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .send(sampleDocuments[2])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect('Content-Type', 'json', done);
        expect(res.body).to.be.an('object');
        expect(res.body._id).not.to.be.undefined;
        expect(res.body.title).to.equal(sampleDocuments[2].title);
        expect(res.body.content).to.equal(sampleDocuments[2].content);
        done();
      });
  });

  it('validates that a document is created by a admin logged in (POST /api/documents)', (done) => {
    request
      .post(`${url}/api/documents`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .send(sampleDocuments[3])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body._id).not.to.be.undefined;
        expect(res.body.title).to.equal(sampleDocuments[3].title);
        expect(res.body.content).to.equal(sampleDocuments[3].content);
        done();
      });
  });

  it('validates that all documents, limited by a specified number and ordered by published date, that can be accessed by a role ADMINISTRATOR, are returned when getAllDocumentsByRoleAdministrator is called', (done) => {
    request
      .get(`${url}/api/documents/admin`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        const lastItem = res.body[res.body.length - 1];
        const firstItem = res.body[res.body.length - 2];

        expect(res.status).to.equal(200);
        expect(lastItem.dateCreated).to.equal(firstItem.dateCreated);
        done();
      });
  });

  it('validates that any users document can be updated by an Administrator (PUT /api/documents)/:id', (done) => {
    request
      .put(`${url}/api/documents/${doc1id}`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .send({
        title: 'Frodo',
        content: 'A character in LOTR.',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Successfully updated Document!');
        done();
      });
  });

  it('validates that any users document can be deleted by an Administrator (DELETE /api/documents)/:id', (done) => {
    request
      .del(`${url}/api/documents/${doc2id}`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message.title).to.equal(sampleDocuments[1].title);
        expect(res.body.message.content).to.equal(sampleDocuments[1].content);
        done();
      });
  });
});

// tests for manipulating documents access
describe('Document tests requiring authentication', () => {
  // logout first
  beforeEach((done) => {
    request
      .get('http://localhost:3000/api/users/logout')
      .set('x-access-token', authToken)
      .end(() => {
        authToken = '';
        done();
      });
  });

  // perform login function first
  beforeEach((done) => {
    request
      .post(`${url}/api/users/login`)
      .send({ username: 'tn', password: '12345' })
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  it('validates that a document can only be updated by the creator or an Administrator (PUT /api/documents/:id)', (done) => {
    request
      .put(`${url}/api/documents/${doc1id}`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .send({ title: 'Frodo', content: 'A character in LOTR.' })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Forbidden to update this document.');
        done();
      });
  });

  it('validates that a document can only be deleted by the creator or an Administrator (DELETE /api/documents/:id)', (done) => {
    request
      .del(`${url}/api/documents/${doc1id}`)
      .set('x-access-token', authToken)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Forbidden to delete this document.');
        done();
      });
  });
});
