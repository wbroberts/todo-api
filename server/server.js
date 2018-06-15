require('./config/config');

const express = require('express');
const app = express();
const c = require('ansi-colors');

const port = process.env.PORT;

const { mongoose } = require('./db/mongoose');

// Routes for db
const userRoute = require('./api/users');
const todoRoute = require('./api/todos');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/users', userRoute);
app.use('/todos', todoRoute);

// This is the actual server running
app.listen(port, () => {
  console.log(`App is running on port ${c.blue(port)}`);
});

module.exports = {
  app
}