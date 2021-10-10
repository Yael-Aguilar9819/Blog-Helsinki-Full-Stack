const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog'); // With '..' go back 1 dir
const User = require('../models/user'); // Needed to populate the user object

// This are the main routes of the blog file
// Now it's refactored into an async/await functions
blogRouter.get('/', async (request, response) => {
  // populate fills the user target with it's id, username, and name
  const allBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(allBlogs);
});

blogRouter.post('/', async (request, response, next) => {
  try {
    // The user is obtained from the middleware that pre-processed request
    const user = request.user

    // The body is directly modified to add the user ID
    request.body.user = user._id;

    const blog = new Blog(request.body);

    // The server response it's the same blog with the id
    const blogResponseFromServer = await blog.save();

    // The user is modified automatically, it's not necessary to do it manually

    // Then it's converted to json and returned to whatever method called POST
    response.status(201).json(blogResponseFromServer);
  } catch (exception) {
    next(exception);
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    // This will determine if the token is correct, otherwise, throws an error
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }

    // The token is correct and exists, but it's not known
    // if the user deleting the blog Its the same as the one who created it
    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
      return response.status(404).json({ error: 'Blog was not found' });
    }

    // Stringify converts the object into a string
    // And slice method removes the double quotes
    const IsTheSameUser = JSON.stringify(blogToDelete.user).slice(1, -1) === decodedToken.id;
    if (!IsTheSameUser) {
      return response.status(401).json({ error: 'Only the creator can delete its own blogs' });
    }
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
