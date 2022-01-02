// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// Installed with 'npm install mongoose-unique-validator'
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
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
const User = mongoose.model('User', userSchema);

// module.exports = User;
export default User;
