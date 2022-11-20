// The main application script, ties everything together.
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

const http = require('http').Server(app);

require('dotenv').config();

const config = require('./server/config/config');

// connect to Mongo when the app initializes
mongoose
  .connect(config.database)
  .then(() => console.info('Server connected to the database.'))
  .catch((err) => console.error(err));

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(express.static(`${__dirname}/public`));

const api = require('./server/routes/index')(app, express);

app.use('/api', api);

app.get('*', (req, res) => {
  res.send('System Under Construction...');
});

http.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening on port: ${config.port}`);
  }
});
