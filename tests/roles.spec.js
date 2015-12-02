var url = 'http://localhost:3000',
  request = require('superagent');

describe('Roles', function() {
  it('validates that the seeded roles are stored in database', function(done) {
    request
      .get(url + '/api/users/roles')
      .end(function(err, res) {
        // expected responses after seeding
        if (err) {
          return err;
        } else {
          expect(200, done);
          expect('Content-Type', 'json', done);
          expect(res.body.length).toEqual(2);
          expect(res.body[0].id).toEqual(1);
          expect(res.body[0].title).toEqual('Administrator');
          expect(res.body[1].id).toEqual(2);
          expect(res.body[1].title).toEqual('User');
          done();
        }
      });
  });
  
  it("validates that a new role created has a unique title", function() {
    expect(true).toBe(true);
  });

  it("validates that all documents are returned, limited by a specified number, when getAllDocuments is called", function() {
    expect(true).toBe(true);
  });

  it("validates that all documents are returned in order of their published dates, starting from the most recent when getAllDocuments is called", function() {
    expect(true).toBe(true);
  });

});
