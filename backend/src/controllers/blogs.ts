const blogRouter = require('express').Router();
// const Blog = require('../models/blog'); // With '..' go back 1 dir
import Blog from '../models/blog';

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
    const { user } = request;
    // The body is directly modified to add the user ID
    request.body.user = user._id;

    const blog = new Blog(request.body);

    const blogSaved = await blog.save();
    // Another request to get the user populated automatically
    const blogFromServ = await Blog.findById(blogSaved)
      .populate('user', { username: 1, name: 1 });

    // The user is modified automatically, it's not necessary to do it manually
    await saveBlogIDinUserCollection(request.user, blogFromServ);
    // Then it's converted to json and returned to whatever method called POST
    response.status(201).json(blogFromServ);
  } catch (exception) {
    next(exception);
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    // The token is correct and exists, but it's not known
    // if the user deleting the blog Its the same as the one who created it
    const blogToDelete = await Blog.findById(request.params.id);
    if (!blogToDelete) {
      return response.status(404).json({ error: 'Blog was not found' });
    }

    // The function converts the object into a string and removes the double quotes
    const IsTheSameUser = formatUserIDInBlogs(blogToDelete.user)
                          === formatUserIDInBlogs(request.user._id);
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
    // request.params is an object made of the arguments in the URL
    // With new : true, it returns the updated object, the default will return the old object
    // and .populate asks the DB to query the ID and return a full user
    const resp = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
      .populate('user', { username: 1, name: 1 });
    response.status(200).json(resp);
  } catch (exception) {
    next(exception);
  }
});

const saveBlogIDinUserCollection = async (userObj, blogToSave) => {
  // The userObj can be used directly without searching again in the DB
  // then it's added to the current blogs in the user blogs
  userObj.blogs = userObj.blogs.concat(blogToSave._id);

  // The response it's not necessary
  await userObj.save();
};

const formatUserIDInBlogs = userID => JSON.stringify(userID).slice(1, -1);

module.exports = blogRouter;
