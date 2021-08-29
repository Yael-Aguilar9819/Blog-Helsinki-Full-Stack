const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const allUsers = await User.find({});
  response.json(allUsers);
});

userRouter.post('/', async (request, response, next) => {
  const { body } = request;

  const saltRounds = 10;

  // This hash the password with the number of salt round
  // How it works: https://github.com/kelektiv/node.bcrypt.js#readme
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  // This could fail due to how the model is implemented
  try {
    // This what creates a new user
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

// This exposes the module to the main app
module.exports = userRouter;
