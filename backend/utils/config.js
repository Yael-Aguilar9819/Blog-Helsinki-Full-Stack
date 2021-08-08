// This file contains all the enviroment variables used in the app
require('dotenv').config();

// This are the env variables, the data is from the git-ignored .env file
const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
