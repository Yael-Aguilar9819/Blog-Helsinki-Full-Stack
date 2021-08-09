const blogRouter = require('express').Router();
const Blog = require('../models/blog'); // With '..' go back 1 dir

// This are the main routes of the blog file
// Now it's refactored into an async/await functions
blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({});
  response.json(allBlogs);
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  // The server response it's the same blog with the id
  const responseFromServer = await blog.save();
  // Then it's converted to json and returned to whatever method called POST
  response.status(201).json(responseFromServer);
});

module.exports = blogRouter;
