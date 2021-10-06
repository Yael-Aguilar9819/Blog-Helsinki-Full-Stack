const logger = require('./logger');
const User = require('../models/user'); // Needed to populate the user object


const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
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
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } if (error.name === 'JsonWebTokenError') {
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

const userExtractor = (request, response, next) => {
  // console.log(request.token)
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  console.log(decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  // const user = await User.findById(request.token);
  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
