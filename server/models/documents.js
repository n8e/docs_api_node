// require needed modules
const mongoose = require('mongoose');

const { Schema } = mongoose;

// create a schema
const DocumentSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  lastModified: {
    type: Date,
    default: Date.now(),
  },
});

// make the model available to our users in our Node applications
module.exports = mongoose.model('Document', DocumentSchema);
