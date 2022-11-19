/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/users');

const { secretKey } = config;

(function () {
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
      return user
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
    login(req, res) {
      User.findOne({
        username: req.body.username,
      }).exec((err, user) => {
        if (err) {
          throw err;
        }
        if (!user) {
          res.status(500).send({
            message: "User doesn't exist",
          });
        } else if (user) {
          const validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.status(500).send({
              message: 'Invalid Password',
            });
          } else {
            // token
            delete user.password;
            const token = createToken(user.toJSON());
            res.json({
              id: user._id,
              success: true,
              message: 'Successfully logged in!',
              token,
            });
          }
        }
      });
    },

    // logout function
    logout(req, res) {
      delete req.headers['x-access-token'];
      return res.status(200).json({
        message: 'User has been successfully logged out',
      });
    },

    // to get the mongo cluster of all the users stored on the db
    getAll(req, res) {
      User.find({}, (err, users) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(users);
      });
    },

    // get user by id
    get(req, res) {
      const { id } = req.params;
      User.find(
        {
          _id: id,
        },
        (err, users) => {
          if (err) {
            res.send(err);
            return;
          }
          res.json(users);
        },
      );
    },

    // to get the mongo cluster of all the user roles
    getAllUsersRoles(req, res) {
      User.find(
        {
          role: 'User',
        },
        (err, users) => {
          if (err) {
            res.send(err);
            return;
          }
          res.json(users);
        },
      );
    },

    // to get the mongo cluster of all the user roles
    getAllAdminRoles(req, res) {
      User.find(
        {
          role: 'Administrator',
        },
        (err, users) => {
          if (err) {
            res.send(err);
            return;
          }
          res.json(users);
        },
      );
    },

    // update user by id
    update(req, res) {
      const { id } = req.params;
      // update function
      const updateMe = function (id) {
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
          (err, users) => {
            if (err) {
              res.send(err);
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
        const id5 = id;
        updateMe(id5.trim());
      } else if (id) {
        const id6 = req.decoded._id;
        updateMe(id6.trim());
      } else if (req.decoded.role === 'Administrator' && !id) {
        const id7 = req.decoded._id;
        updateMe(id7.trim());
      }
    },

    // delete user by id
    delete(req, res) {
      // delete function
      const deleteMe = function (id) {
        User.findOneAndRemove(
          {
            _id: id,
          },
          (err, user) => {
            if (err) {
              res.json(401, {
                message: err,
              });
            } else {
              res.json(200, {
                message: user,
              });
            }
          },
        );
      };
      if (req.decoded.role === 'Administrator') {
        const { id } = req.params;
        deleteMe(id.trim());
      } else if (req.decoded._id === req.params.id) {
        const id1 = req.decoded._id;
        deleteMe(id1.trim());
      } else {
        res.json(403, {
          message: 'Not allowed to delete this user.',
        });
      }
    },
  };
})();
