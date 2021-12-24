"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
loginRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // to simplify usage, added the body variable
    const { body } = request;
    const user = yield User.findOne({ username: body.username });
    if (!body.password) {
        return response.status(401).json({
            error: 'password was not given',
        });
    }
    const passwordCorrect = user === null
        ? false
        // this will compare the password given with the hash using bcrypt
        : yield bcrypt.compare(body.password, user.passwordHash);
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
}));
module.exports = loginRouter;
