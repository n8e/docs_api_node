(function() {
  'use strict';
  // get the required models and db connection
  var config = require('../config/config'),
    User = require('../models/users'),
    Document = require('../models/documents'),
    Role = require('../models/roles'),
    jsonwebtoken = require('jsonwebtoken'),
    moment = require('moment'),
    secretKey = config.secretKey;

  var userId;

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
    // gets all the saved roles from the db
    getRoles: function(req, res) {
      Role.find({}, function(err, roles) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(roles);
      });
    },
    // creates a role in the db
    createRole: function(req, res) {
      var role = new Role({
        id: req.body.id,
        title: req.body.title
      });
      role.save(function(err) {
        if (err) {
          res.send(err);
          return;
        }
        res.json({
          success: true,
          message: 'Role has been created!'
        });
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
    // get document by id
    getDocument: function(req, res) {
      var id = req.param('id');
      Document.find({
        _id: id
      }, function(err, documents) {
        if (err) {
          res.send(err);
          return;
        }
        res.send(documents);
      });
    },
    // to get the mongo cluster of all the documents stored
    getAllDocuments: function(req, res) {
      Document.find({}, function(err, documents) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(documents);
      });
    },
    createDocument: function(req, res) {
      var document = new Document({
        ownerId: req.decoded._id,
        title: req.body.title,
        content: req.body.content
      });
      document.save(function(err) {
        if (err) {
          res.send(err);
          return;
        }
        res.json({
          success: true,
          message: 'Document has been created!'
        });
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
          } else if (users === null){
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
      if (req.decoded.role === 'Administrator' && req.param('id')) {
        var id5 = req.param('id');
        updateMe(id5.trim());
      } else if (req.param('id')) {
        var id6 = req.decoded._id;
        updateMe(id6.trim());
      } else if (req.decoded.role === 'Administrator' && !req.param('id')) {
        var id7 = req.decoded._id;
        updateMe(id7.trim());
      }
    },
    // update document by id
    updateDocument: function(req, res) {
      var id = req.param('id');
      Document.findById(req.params.id).exec(function(err, document) {
        if (err) {
          res.status(500).send({
            message: 'There was a problem deleting your document.'
          });
        } else {
          if (document === null) {
            res.send({
              message: 'No document found.'
            });
          } else {
            if (req.decoded._id !== document.ownerId && req.decoded.role === 'User') {
              //send 403 status and forbidden message
              res.status(403).send({
                message: 'Forbidden to update this document.'
              });
            } else {
              //delete or update
              Document.findOneAndUpdate({
                  _id: id
                }, {
                  title: req.body.title,
                  content: req.body.content
                }, {
                  title: req.body.title,
                  content: req.body.content
                },
                function(err, documents) {
                  if (err) {
                    res.send(err);
                    return;
                  } else {
                    console.log(documents);
                    res.json({
                      success: true,
                      message: 'Successfully updated Document!'
                    });
                  }
                });
            }
          }
        }
      });
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
    },

    // delete document by id
    deleteDocument: function(req, res) {
      var id = req.param('id');
      Document.findById(req.params.id).exec(function(err, document) {
        if (err) {
          res.status(500).send({
            message: 'There was a problem deleting your document.'
          });
        } else {
          if (document === null) {
            res.send({
              message: 'No document found.'
            });
          } else {
            if (req.decoded._id !== document.ownerId && req.decoded.role === 'User') {
              //send 403 status and forbidden message
              res.status(403).send({
                message: 'Forbidden to delete this document.'
              });
            } else {
              //delete or update
              Document.findOneAndRemove({
                _id: req.params.id
              }).exec(function(err, documents) {
                if (err) {
                  return err;
                } else {
                  res.json(200, {
                    message: documents
                  });
                }
              });
            }
          }
        }
      });
    },
    // to get the mongo cluster of all the documents filtered by 'User' role
    getAllDocumentsByRoleUser: function(req, res) {
      Document.find({})
        .populate('ownerId')
        .limit(4)
        .sort([
          ['dateCreated', 'descending']
        ])
        .exec(function(err, documents) {
          if (err) {
            res.send(err);
            return;
          }
          var filtered = documents.map(
            function(obj) {
              if (obj.ownerId.role === 'User') {
                return obj;
              }
            });
          for (var i = 0; i < filtered.length; i++) {
            if (filtered[i] === undefined) {
              filtered.splice(i, 1);
            }
          }
          res.json(filtered);
        });
    },


    // to get the mongo cluster of all the documents filtered by 'Administrator' role
    getAllDocumentsByRoleAdministrator: function(req, res) {
      Document.find({})
        .populate('ownerId')
        .limit(4)
        .sort([
          ['dateCreated', 'descending']
        ])
        .exec(function(err, documents) {
          if (err) {
            res.send(err);
            return;
          }
          var filtered = documents.map(
            function(obj) {
              if (obj.ownerId.role === 'Administrator') {
                return obj;
              }
            });
          for (var i = 0; i < filtered.length; i++) {
            if (filtered[i] === undefined) {
              filtered.splice(i, 1);
            }
          }
          console.log(filtered);
          res.json(filtered);
        });
    },
    // to get the mongo cluster of all the documents filtered by date
    getAllDocumentsByDate: function(req, res) {
      Document.find({
          dateCreated: {
            $gt: moment().subtract(1, 'day'),
            $lt: moment().add(1, 'day')
          }
        })
        .limit(4)
        .exec(function(err, documents) {
          if (err) {
            res.send(err);
            return;
          }
          res.json(documents);
        });
    }
  };
})();
