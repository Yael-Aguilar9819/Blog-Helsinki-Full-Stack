const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(resolve => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');
// Needed to populate the user object
const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
// This handles every possible error from the controllers
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }
  next(error);
};
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  // All tokens start with 'bearer '
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // the request gets a parameter called token, with only the token characters
    // No modification needed
    request.token = authorization.substring(7);
  }
  next();
};
const userExtractor = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    // If a token was given, this segment will the used
    if (request.token) {
      // It's verified by the jwt token, unhandled exception now
      const decodedToken = jwt.verify(request.token, process.env.SECRET);
      // if there's no token ID because it doesn't exist exist, this will handle it
      if (!decodedToken.id) {
        request.user = null;
        next();
      }
      // Return the user from the decoded token
      const user = yield User.findById(decodedToken.id);
      request.user = user;
    }
  } catch (exception) {
    next(exception);
  }
  next();
});
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
