(function () {
  'use strict';
  // get the required models and db connection
  const config = require('../config/config'),
    User = require('../models/users'),
    jwt = require('jsonwebtoken'),
    secretKey = config.secretKey;

  // create token for authentication
  const createToken = (user) =>
    jwt.sign(user, secretKey, {
      subject: user.username,
      expiresIn: 1440,
      algorithm: 'HS256',
    });

  module.exports = {
    // to add a user to the db
    create: async (req, res) => {
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      });
      // hash the password first
      user.password = User.hashPassword(user.password);
      // save the user object
      return await user
        .save()
        .then(() =>
          res.json({
            success: true,
            message: 'User has been created!',
          }),
        )
        .catch((err) => res.status(403).send(err));
    },

    // to login user into docs_api_node system
    login: function (req, res) {
      User.findOne({
        username: req.body.username,
      }).exec(function (err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.status(500).send({
            message: "User doesn't exist",
          });
        } else if (user) {
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.status(500).send({
              message: 'Invalid Password',
            });
          } else {
            // token
            delete user.password;
            var token = createToken(user.toJSON());
            res.json({
              id: user._id,
              success: true,
              message: 'Successfully logged in!',
              token: token,
            });
          }
        }
      });
    },

    // logout function
    logout: function (req, res) {
      delete req.headers['x-access-token'];
      return res.status(200).json({
        message: 'User has been successfully logged out',
      });
    },

    // to get the mongo cluster of all the users stored on the db
    getAll: function (req, res) {
      User.find({}, function (err, users) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },

    // get user by id
    get: function (req, res) {
      var id = req.params.id;
      User.find(
        {
          _id: id,
        },
        function (err, users) {
          if (err) {
            res.send(err);
            return;
          }
          res.json(users);
        },
      );
    },

    // to get the mongo cluster of all the user roles
    getAllUsersRoles: function (req, res) {
      User.find(
        {
          role: 'User',
        },
        function (err, users) {
          if (err) {
            res.send(err);
            return;
          }
          res.json(users);
        },
      );
    },

    // to get the mongo cluster of all the user roles
    getAllAdminRoles: function (req, res) {
      User.find(
        {
          role: 'Administrator',
        },
        function (err, users) {
          if (err) {
            res.send(err);
            return;
          }
          res.json(users);
        },
      );
    },

    // update user by id
    update: function (req, res) {
      var id = req.params.id;
      // update function
      var updateMe = function (id) {
        User.findOneAndUpdate(
          {
            _id: id,
          },
          {
            name: {
              first: req.body.firstname,
              last: req.body.lastname,
            },
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
          },
          {
            name: {
              first: req.body.firstname,
              last: req.body.lastname,
            },
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
          },
          function (err, users) {
            if (err) {
              res.send(err);
              return;
            } else if (!users) {
              res.send({
                message: 'Not Authorised to update this user.',
              });
            } else {
              res.json({
                success: true,
                message: 'Successfully updated User!',
              });
            }
          },
        );
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
    delete: function (req, res) {
      // delete function
      var deleteMe = function (id) {
        User.findOneAndRemove(
          {
            _id: id,
          },
          function (err, user) {
            if (err) {
              res.json(401, {
                message: err,
              });
              return;
            } else {
              res.json(200, {
                message: user,
              });
            }
          },
        );
      };
      if (req.decoded.role === 'Administrator') {
        var id = req.params.id;
        deleteMe(id.trim());
      } else if (req.decoded._id === req.params.id) {
        var id1 = req.decoded._id;
        deleteMe(id1.trim());
      } else {
        res.json(403, {
          message: 'Not allowed to delete this user.',
        });
      }
    },
  };
})();
