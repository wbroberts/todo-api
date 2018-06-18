require('./config/config');

const express = require('express');
const app = express();
const c = require('ansi-colors');

const port = process.env.PORT;

const { mongoose } = require('./db/mongoose');

// Routes for db
const userRoute = require('./api/users');
const todoRoute = require('./api/todos');

app.use(express.static(__dirname + './../public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/users', userRoute);
app.use('/todos', todoRoute);

app.get('/', (req, res) => {
  res.render('index');
});

// This is the actual server running
app.listen(port, () => {
  console.log(`App is running on port ${c.blue(port)}`);
});

module.exports = {
  app
}