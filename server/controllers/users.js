/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/users');

const { secretKey } = config;

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
    return User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) {
          return res.status(500).send({
            message: `User with username: ${req.body.username} doesn't exist!`,
          });
        }

        const validPassword = user.comparePassword(req.body.password);

        if (!validPassword) {
          return res.status(500).send({ message: 'Invalid Password' });
        }

        // token
        const token = createToken(user.toJSON());
        return res.json({
          id: user._id,
          success: true,
          message: 'Successfully logged in!',
          token,
        });
      })
      .catch((err) => res.send(err));
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
    const { page, limit } = req.params;

    return User.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .then((users) => res.json(users))
      .catch((err) => res.send(err));
  },

  // get user by id
  get(req, res) {
    const { id } = req.params;

    return User.find({ _id: id })
      .then((users) => res.json(users))
      .catch((err) => res.send(err));
  },

  // to get the mongo cluster of all the user roles
  getAllUsersRoles(req, res) {
    const { page, limit } = req.params;

    return User.find({ role: 'User' })
      .skip((page - 1) * limit)
      .limit(limit)
      .then((users) => res.json(users))
      .catch((err) => res.send(err));
  },

  // to get the mongo cluster of all the user roles
  getAllAdminRoles(req, res) {
    const { page, limit } = req.params;

    return User.find({ role: 'Administrator' })
      .skip((page - 1) * limit)
      .limit(limit)
      .then((users) => res.json(users))
      .catch((err) => res.send(err));
  },

  // update user by id
  update(req, res) {
    // update only allowed for authorised user of themselves or admin
    const isPermittedUser =
      req.decoded.role === 'Administrator' || req.decoded._id === req.params.id;

    if (!isPermittedUser) {
      return res.json(403, {
        message: 'Not allowed to update this user.',
      });
    }

    return User.findOneAndUpdate(
      { _id: req.params.id },
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      },
    )
      .then((user) =>
        res.json({
          user,
          success: true,
          message: 'Successfully updated User',
        }),
      )
      .catch((err) => res.send(err));
  },

  // delete user by id
  delete(req, res) {
    // delete only allowed for authorised user of themselves or admin
    const isPermittedUser =
      req.decoded.role === 'Administrator' || req.decoded._id === req.params.id;

    if (!isPermittedUser) {
      return res.json(403, {
        message: 'Not allowed to delete this user.',
      });
    }

    return User.findOneAndRemove({ _id: req.params.id })
      .then((user) => res.status(200).json({ message: user }))
      .catch((err) => res.status(500).json({ message: err }));
  },
};
