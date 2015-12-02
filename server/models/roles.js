// require needed modules
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = require('./users');

// create a schema
var RolesSchema = new Schema({
  id: {
    type: Number,
    unique:true
  },
  title: {
    type: String,
    enum: ['Administrator', 'User', 'Standard'],
    default: 'Standard',
    unique: true
  }

});

// make the model available to our users in our Node applications
module.exports = mongoose.model('Roles', RolesSchema);
