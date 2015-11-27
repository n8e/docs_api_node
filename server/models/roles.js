// require needed modules
var mongoose = require('mongoose'),
  User = require('./users'),
  Document = require('./documents'),
  Schema = mongoose.Schema;

// create a schema
var RolesSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }
});

// make the model available to our users in our Node applications
module.exports = mongoose.model('Roles', RolesSchema);