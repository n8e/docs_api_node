// require the modules for database and password
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt');

// create a schema
let UserSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
    dropDups: true,
  },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    dropDups: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['User', 'Administrator'],
    required: true,
  },
});

UserSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// make the model available to our users in our Node applications
module.exports = mongoose.model('User', UserSchema);
