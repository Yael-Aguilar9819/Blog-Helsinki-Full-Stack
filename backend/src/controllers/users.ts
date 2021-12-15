const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

const minimumPasswordLength = 3;

userRouter.get('/', async (_request: basicRequest, response: basicResponse) => {
  const allUsers = await User.find({}).populate('blogs', {
    url: 1, title: 1, author: 1, id: 1,
  });
  response.json(allUsers);
});

userRouter.post('/', async (request: basicRequest, response: basicResponse, next) => {
  const { body } = request;

  // This hash the password with the number of salt rounds
  // How it works: https://github.com/kelektiv/node.bcrypt.js#readme
  // If body.password exists, then it's salted and hashed
  // otherwise, it stays undefined, so the mongoose validators can catch it
  const saltRounds = 10;
  const passwordHash = body.password
    ? await bcrypt.hash(body.password, saltRounds)
    : undefined;

  // If it's false, it going to terminate the route early
  if (!checkPasswordLength(body.password, minimumPasswordLength)) {
    return response.status(400).json({ error: `password too short, must be at least ${minimumPasswordLength}` });
  }

  // This could fail due to how the model is implemented, so try/except is used
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

const checkPasswordLength = (possiblePass: string, minimumLength: number) => {
  try {
    // Using the ternary operator, we check if it's the minimum length
    const result = possiblePass.length >= minimumLength;
    return result;
  } catch (error) {
    // If it doesn't exist, or it's another type, it going to return this
    return false;
  }
};

// This exposes the module to the main app
module.exports = userRouter;
