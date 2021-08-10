const mongoose = require('mongoose');

// Every attribute in the schema can be extended with various filters
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 },
});

// It's necessary to reassign params in this case, because otherwise it would return a
/* eslint-disable no-param-reassign */
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
/* eslint-enable no-param-reassign */

// This makes the module available to the rest of the app
module.exports = mongoose.model('Blog', blogSchema); // The first argument defines how the collection is going to be named
