const http = require('http');
const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');

const config = require('./utils/config');
const middleware = require('./utils/middleware');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true,
});

app.use(cors());
app.use(express.json());

// This middleware prints every incoming request, no matter the method
// Now it's before others middlewares so it's always invoked
app.use(middleware.requestLogger);

// Being a router means that every endpoint + the blogs URL will be redirected here
app.use('/api/blogs', blogRouter);

// This router redirects to the user endpoint
app.use('/api/users', usersRouter);

// If url is unknown, this dispatches
app.use(middleware.unknownEndpoint);

// If there's an error, it goes through here
app.use(middleware.errorHandler);

module.exports = app;
