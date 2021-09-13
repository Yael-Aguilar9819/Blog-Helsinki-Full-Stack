const blogRouter = require('express').Router();
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
    // The body is directly modified to add the user ID
    // request.body.user = request.body.userId;
    request.body.user = request.body.userId;
    const blog = new Blog(request.body);
    // The server response it's the same blog with the id
    const blogResponseFromServer = await blog.save();
    // Then we modify the User object in it's own collection
    await saveBlogIDinUserCollection(request.body.userId, blogResponseFromServer);
    
    // Then it's converted to json and returned to whatever method called POST
    response.status(201).json(blogResponseFromServer);
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

const saveBlogIDinUserCollection = async (userID, blogToSave) => {
  const user = await User.findById(userID)
  // then it's added to the current blogs in the user blogs
  user.blogs = user.blogs.concat(blogToSave._id)
  // and saved
  await user.save()
}

module.exports = blogRouter;
