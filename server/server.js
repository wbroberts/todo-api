require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const c = require('ansi-colors');

const { mongoose } = require('./db/mongoose');

const app = express();
const port = process.env.PORT;

const userRoute = require('./api/users');
const todoRoute = require('./api/todos');

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/users', userRoute);
app.use('/todos', todoRoute);

// This is the actual server running
app.listen(port, () => {
  console.log(`App is running on port ${c.blue(port)}`);
});

module.exports = {
  app
}