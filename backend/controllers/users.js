const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { body } = request;

  const saltRounds = 10;

  // This basically hash the password with the number of salt round
  // How it works: https://github.com/kelektiv/node.bcrypt.js#readme
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  // This what creates a new user
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

// This exposes the module to the main app
module.exports = usersRouter;
