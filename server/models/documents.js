// require needed modules
var mongoose = require('mongoose'),
  User = require('./users'),
  Schema = mongoose.Schema;

// create a schema
var DocumentSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String
  },
  content: {
    type: String
  },
  dateCreated: {
    type: Date,
    default: Date.now().toUTCString()
  },
  lastModified: {
    type: Date,
    default: Date.now().toUTCString()
  }
});

// make the model available to our users in our Node applications
module.exports = mongoose.model('Document', DocumentSchema);