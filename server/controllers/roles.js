(function() {
  'use strict';
  // get the required models and db connection
  var config = require('../config/config'),
    Role = require('../models/roles'),
    jsonwebtoken = require('jsonwebtoken'),
    moment = require('moment'),
    secretKey = config.secretKey;

  module.exports = {
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
    }
  };
})();
