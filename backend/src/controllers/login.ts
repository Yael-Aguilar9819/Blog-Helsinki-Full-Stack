// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// import express from 'express';
// const Response = require('express').Response();
// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt';
// const loginRouter = require('express').Router();
import { Request, Response, Router as loginRouter } from 'express';
// const User = require('../models/user');
import User from '../models/user';

loginRouter.post('/', async (request: Request, response: Response) => {
  // to simplify usage, added the body variable
  const { body } = request;
  const user = await User.findOne({ username: body.username });

  if (!body.password) {
    return response.status(401).json({
      error: 'password was not given',
    });
  }

  const passwordCorrect = user === null
    ? false
    // this will compare the password given with the hash using bcrypt
    : await bcrypt.compare(body.password, user.passwordHash);

  // if it fails, it's going to return this
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  // This will create the object that is going to be made into the token
  // signed by a key that is given by the admin
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  // Then it's send back to the user
  return response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
