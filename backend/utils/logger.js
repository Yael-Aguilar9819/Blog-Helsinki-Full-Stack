/* eslint-disable no-console */
var info = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'test') {
        console.log.apply(console, params);
    }
};
var error = function () {
    var params = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        params[_i] = arguments[_i];
    }
    if (process.env.NODE_ENV !== 'test') {
        console.log.apply(console, params);
    }
};
/* eslint-enable no-console */
module.exports = {
    info: info,
    error: error
};
