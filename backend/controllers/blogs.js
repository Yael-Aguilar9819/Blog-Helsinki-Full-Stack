const blogRouter = require('express').Router();
const Blog = require('../models/blog'); // With '..' go back 1 dir

// This are the main routes of the blog file
// Now it's refactored into an async/await function
blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({});
  response.json(allBlogs);
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
