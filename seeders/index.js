var request = require('superagent'),
  url = 'http://localhost:3000';
module.exports = {
  seeder: function() {
    var user = {
        firstname: 'Sadiq',
        lastname: 'Malika',
        password: '12345',
        email: 'smalik@gmail.com',
        username: 'smalik',
        role: 2
      },
      secUser = {
        firstname: 'Thomas',
        lastname: 'Nyambati',
        password: '12345',
        email: 'tnyambati@gmail.com',
        username: 'tn',
        role: 2
      },
      admin = {
        username: 'Sonnie',
        password: '12345',
        firstname: 'Sonia',
        lastname: 'Granger',
        email: 'sgranger@gmail.com',
        role: 1
      };

    // seed role 1 for Administrator
    (function rolesAdminSeed() {
      var roleAdmin = {
        id: 1,
        title: 'Administrator'
      };
      request
        .post(url + '/api/users/roles')
        .send(roleAdmin)
        .end(function(err) {
          if (err) {
            return err;
          } else {
            console.log('Seeded role Administrator');
          }
        });
    })();
    // seed role 2 for User
    (function rolesUserSeed() {
      var roleUser = {
        id: 2,
        title: 'User'
      };
      request
        .post(url + '/api/users/roles')
        .send(roleUser)
        .end(function(err) {
          if (err) {
            return err;
          } else {
            console.log('Seeded role User');
          }
        });
    })();
    // seed sample user
    (function userSeed() {
      request
        .post(url + '/api/users')
        .send(user)
        .end(function(err) {
          if (err) {
            return err;
          } else {
            console.log('Seeded user Malika');
          }
        });
    })();
    // seed sample second user
    (function userSeed() {
      request
        .post(url + '/api/users')
        .send(secUser)
        .end(function(err) {
          if (err) {
            return err;
          } else {
            console.log('Seeded user Thomas');
          }
        });
    })();
    // seed sample admin
    (function adminSeed() {
      request
        .post(url + '/api/users')
        .send(admin)
        .end(function(err) {
          if (err) {
            return err;
          } else {
            console.log('Seeded admin Sonnie');
          }
        });
    })();
  }
};
