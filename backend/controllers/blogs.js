const blogRouter = require('express').Router();
const Blog = require('../models/blog'); // With '..' go back 1 dir

// This are the main routes of the blog file
blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

blogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);
  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

module.exports = blogRouter;
