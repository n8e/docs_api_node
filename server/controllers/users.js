(function() {
  'use strict';
  // get the required models and db connection
  var config = require('../config/config'),
    User = require('../models/users'),
    Role = require('../models/roles'),
    jsonwebtoken = require('jsonwebtoken'),
    secretKey = config.secretKey;

  // create token for authentication
  function createToken(user) {
    var token = jsonwebtoken.sign(user, secretKey, {
      expiresIn: 1440
    });
    return token;
  }

  module.exports = {
    // to add a user to the db
    createUser: function(req, res) {
      var user = new User({
        name: {
          first: req.body.firstname,
          last: req.body.lastname
        },
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      // find a role based on the input on the body
      Role.find({
        id: req.body.role
      }, function(err, roles) {
        if (err) {
          res.send(err);
        }
        //
        // add the role to the user before being saved
        //
        console.log(JSON.stringify(roles));
        user.role = roles[0].title;
        // assign a token to the created user
        var token = createToken(user);
        // save the user object
        user.save(function(err) {
          if (err) {
            res.send(err);
            return;
          }
          console.log(user);
          res.json({
            success: true,
            message: 'User has been created!',
            token: token
          });
        });
      });
    },

    // to login user into docms system
    login: function(req, res) {
      User.findOne({
        username: req.body.username
      }).select('name username password').exec(function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.status(500).send({
            message: 'User doesnt exist'
          });
        } else if (user) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.status(500).send({
              message: 'Invalid Password'
            });
          } else {
            ///// token
            var token = createToken(user);

            res.json({
              id: user._id,
              success: true,
              message: 'Successfully logged in!',
              token: token
            });
          }
        }
      });
    },
    // logout function
    logout: function(req, res) {
      delete req.headers['x-access-token'];
      return res.status(200).json({
        'message': 'User has been successfully logged out'
      });
    },
    // to get the mongo cluster of all the users stored on the db
    getAllUsers: function(req, res) {
      User.find({}, function(err, users) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },
    // get user by id
    getUser: function(req, res) {
      var id = req.param('id');
      User.find({
        _id: id
      }, function(err, users) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },
    // to get the mongo cluster of all the user roles
    getAllUsersRoles: function(req, res) {
      User.find({
        'role': 'User'
      }, function(err, users) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },
    // to get the mongo cluster of all the user roles
    getAllAdminRoles: function(req, res) {
      User.find({
        'role': 'Administrator'
      }, function(err, users) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },
    // update user by id
    updateUser: function(req, res) {
      var id = req.param('id');
      // update function
      var updateMe = function(id) {
        User.findOneAndUpdate({
          _id: id
        }, {
          name: {
            first: req.body.firstname,
            last: req.body.lastname
          },
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role
        }, {
          name: {
            first: req.body.firstname,
            last: req.body.lastname
          },
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          role: req.body.role
        }, function(err, users) {
          if (err) {
            res.send(err);
            return;
          } else if (users === null) {
            res.send({
              message: 'Not Authorised to update this user.'
            });
          } else {
            res.json({
              success: true,
              message: 'Successfully updated User!'
            });
          }
        });
      };
      if (req.decoded.role === 'Administrator' && id) {
        var id5 = id;
        updateMe(id5.trim());
      } else if (id) {
        var id6 = req.decoded._id;
        updateMe(id6.trim());
      } else if (req.decoded.role === 'Administrator' && !id) {
        var id7 = req.decoded._id;
        updateMe(id7.trim());
      }
    },
    // delete user by id
    deleteUser: function(req, res) {
      // delete function
      var deleteMe = function(id) {
        User.findOneAndRemove({
            _id: id
          },
          function(err, users) {
            if (err) {
              res.json(401, {
                message: err
              });
              return;
            } else {
              res.json(200, {
                message: users
              });
            }
          });
      };
      if (req.decoded.role === 'Administrator' && req.param('id')) {
        var id = req.param('id');
        deleteMe(id.trim());
      } else if (req.param('id')) {
        var id1 = req.decoded._id;
        deleteMe(id1.trim());
      } else if (req.decoded.role === 'Administrator' && !req.param('id')) {
        var id2 = req.decoded._id;
        deleteMe(id2.trim());
      }
    }
  };
})();
