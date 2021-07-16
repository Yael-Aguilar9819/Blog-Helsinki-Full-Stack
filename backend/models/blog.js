const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

// This makes the module available to the rest of the app
module.exports = mongoose.model('Note', blogSchema);
