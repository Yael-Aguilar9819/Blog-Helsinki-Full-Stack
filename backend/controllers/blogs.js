const blogRouter = require('express').Router();
const Blog = require('../models/blog'); // With '..' go back 1 dir
const middleware = require('../utils/middleware');

// This are the main routes of the blog file
// Now it's refactored into an async/await functions
blogRouter.get('/', async (request, response) => {
  const allBlogs = await Blog.find({});
  response.json(allBlogs);
});

blogRouter.post('/', async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    // The server response it's the same blog with the id
    const responseFromServer = await blog.save();
    // Then it's converted to json and returned to whatever method called POST
    response.status(201).json(responseFromServer);
  } catch (exception) {
    next(exception);
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    // With this function, it goes, removes it, and returns back that deleted object
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

blogRouter.put('/:id', async (request, response, next) => {
  try {
    // With request.body is what is given in the body
    // and request.params is an object made of the arguments in the URL
    // With new : true, it returns the updated object, the default will return the old object
    const resp = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
    response.status(200).json(resp);
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogRouter;
