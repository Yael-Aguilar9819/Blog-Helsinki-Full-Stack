"use strict";
/* eslint-disable no-console */
const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};
const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};
/* eslint-enable no-console */
module.exports = {
    info, error,
};
