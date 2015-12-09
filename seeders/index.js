var User = require('../server/models/users'),
  Role = require('../server/models/roles'),
  mongoose = require('mongoose');

module.exports = {
  seeder: function() {
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) {
        return err;
      } else {
        console.log('Dropped database before seeding');
        (function() {
          // seed.seeder();
          var user = new User({
              firstname: 'Sadiq',
              lastname: 'Malika',
              password: '12345',
              email: 'smalik@gmail.com',
              username: 'smalik',
              role: 2
            }),
            secUser = new User({
              firstname: 'Thomas',
              lastname: 'Nyambati',
              password: '12345',
              email: 'tnyambati@gmail.com',
              username: 'tn',
              role: 2
            }),
            admin = new User({
              username: 'Sonnie',
              password: '12345',
              firstname: 'Sonia',
              lastname: 'Granger',
              email: 'sgranger@gmail.com',
              role: 1
            });

          // seed role 1 for Administrator
          (function rolesAdminSeed() {
            var roleAdmin = new Role({
              id: 1,
              title: 'Administrator'
            });
            roleAdmin.save(function(err) {
              if (err) {
                console.log(err);
                return;
              }
              console.log('Seeded role Administrator');
            });
          })();
          // seed role 2 for User
          (function rolesUserSeed() {
            var roleUser = new Role({
              id: 2,
              title: 'User'
            });
            roleUser.save(function(err) {
              if (err) {
                console.log(err);
                return;
              }
              console.log('Seeded role User');
            });
          })();
          // seed sample user
          (function userSeed() {
            user.save(function(err) {
              if (err) {
                console.log(err);
                return;
              }
              console.log('Seeded user Malika');
            });
          })();
          // seed sample second user
          (function userSeed() {
            secUser.save(function(err) {
              if (err) {
                console.log(err);
                return;
              }
              console.log('Seeded user Thomas');
            });
          })();
          // seed sample admin
          (function adminSeed() {
            admin.save(function(err) {
              if (err) {
                console.log(err);
                return;
              }
              console.log('Seeded admin Sonnie');
            });
          })();
        })();
      }
    });
  }
};
