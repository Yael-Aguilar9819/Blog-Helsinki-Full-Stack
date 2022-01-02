"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
from;
'mongoose-unique-validator';
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    name: String,
    passwordHash: {
        type: String,
        required: true,
    },
    // This is a reference to the Blog model in another file
    blogs: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Blog',
        },
    ],
});
// It's necessary to reassign params in this case, because otherwise it would return a lint error
/* eslint-disable no-param-reassign */
userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    },
});
/* eslint-enable no-param-reassign */
// This is what 'unifies' the unique-validator with the userSchema
userSchema.plugin(uniqueValidator);
// This is what makes it a valid model to mongoose
const User = mongoose_1.default.model('User', userSchema);
// module.exports = User;
exports.default = User;
