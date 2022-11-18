require('dotenv').config();

const User = require('../server/models/users'),
  mongoose = require('mongoose'),
  config = require('../server/config/config');

// seed users
const seedUsers = async () => {
  const users = [
    new User({
      firstname: 'Sadiq',
      lastname: 'Malika',
      password: '12345',
      email: 'smalik@gmail.com',
      username: 'smalik',
      role: 'User',
    }),
    new User({
      firstname: 'Thomas',
      lastname: 'Nyambati',
      password: '12345',
      email: 'tnyambati@gmail.com',
      username: 'tn',
      role: 'User',
    }),
    new User({
      username: 'Sonnie',
      password: '12345',
      firstname: 'Sonia',
      lastname: 'Granger',
      email: 'sgranger@gmail.com',
      role: 'Administrator',
    }),
  ];

  return await Promise.all(
    users.map(async (user) => {
      user.password = User.hashPassword(user.password);
      // find a role based on the input on the body
      return await user
        .save()
        .then((data) => console.log(`Seeded user ${data.firstname}`))
        .catch((err) => console.error(err));
    }),
  );
};

const seeder = async () => {
  return await mongoose
    .connect(config.database)
    .then(
      async () =>
        await mongoose.connection.db
          .dropDatabase()
          .then(async () => await Promise.all([seedUsers()]))
          .then(() => process.exit())
          .catch((err) => {
            throw new Error(err);
          }),
    )
    .catch((err) => console.error(err));
};

seeder();
