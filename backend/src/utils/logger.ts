/* eslint-disable no-console */
const info = (...params: any[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};

const error = (...params: any[]) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
};
/* eslint-enable no-console */

module.exports = {
  info, error,
};
