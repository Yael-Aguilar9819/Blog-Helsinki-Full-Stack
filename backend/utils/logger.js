/* eslint-disable no-console */
const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};
/* eslint-enable no-console */

module.exports = {
  info, error,
};
