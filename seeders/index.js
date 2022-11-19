require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../server/models/users');
const config = require('../server/config/config');

// seed users
const seedUsers = async () => {
  const users = [
    {
      firstname: 'Sadiq',
      lastname: 'Malika',
      password: '12345',
      email: 'smalik@gmail.com',
      username: 'smalik',
      role: 'User',
    },
    {
      firstname: 'Thomas',
      lastname: 'Nyambati',
      password: '12345',
      email: 'tnyambati@gmail.com',
      username: 'tn',
      role: 'User',
    },
    {
      username: 'Sonnie',
      password: '12345',
      firstname: 'Sonia',
      lastname: 'Granger',
      email: 'sgranger@gmail.com',
      role: 'Administrator',
    },
  ];

  return Promise.all(
    users.map(async (user) => {
      const modelUser = new User({ ...user });
      modelUser.password = User.hashPassword(user.password);
      // find a role based on the input on the body
      return modelUser
        .save()
        .then((data) => data)
        .catch((err) => {
          throw new Error(err);
        });
    }),
  );
};

const seeder = async () =>
  mongoose
    .connect(config.database)
    .then(async () =>
      mongoose.connection.db
        .dropDatabase()
        .then(async () => Promise.all([seedUsers()]))
        .then(() => process.exit())
        .catch((err) => {
          throw new Error(err);
        }),
    )
    .catch((err) => {
      throw new Error(err);
    });

seeder();
