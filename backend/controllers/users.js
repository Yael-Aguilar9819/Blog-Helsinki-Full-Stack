const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

const minimumPasswordLength = 3;

userRouter.get('/', async (request, response) => {
  const allUsers = await User.find({});
  response.json(allUsers);
});

userRouter.post('/', async (request, response, next) => {
  const { body } = request;

  // This hash the password with the number of salt rounds
  // How it works: https://github.com/kelektiv/node.bcrypt.js#readme
  // If body.password exists, then it's salted and hashed
  // otherwise, it stays undefined, so the mongoose validators can catch it
  const saltRounds = 10;
  const passwordHash = body.password ? 
    await bcrypt.hash(body.password, saltRounds) 
    : undefined

  if (!checkPasswordLength(request.password, minimumPasswordLength)) {
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

const checkPasswordLength = (possiblePass, minimumLength) => {
  try {
    // Using the ternary operator, we check if it's the minimum length
    const result = possiblePass.length >= minimumLength ? true : false;
    return result;
  } catch (error) { 
    // If it doesn't exist, or it's another type, it going to return this
    return false;
  }
}

// This exposes the module to the main app
module.exports = userRouter;
