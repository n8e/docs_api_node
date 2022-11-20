const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { secretKey } = config;

(function () {
  module.exports = {
    // function checks for the token
    authenticate(req, res, next) {
      const token =
        req.body.token || req.params.token || req.headers['x-access-token'];
      // check if token exists
      if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            res.status(403).send({
              success: false,
              message: 'Failed to authenticate user',
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        res.status(403).send({
          success: false,
          message: 'No token provided!',
        });
      }
    },
  };
})();
