const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  // to simplify usage, added the body variable
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    // this will compare the password given with the hash using bcrypt
    : await bcrypt.compare(body.password, user.passwordHash)

  // if it fails, it's going to return this
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }
  response.status(200).json({
    OK: 'passed succesfully, not token implemented'
  })
})