const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(resolve => { resolve(value); }); }
  return new (P || (P = Promise))((resolve, reject) => {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const blogRouter = require('express').Router();
const Blog = require('../models/blog'); // With '..' go back 1 dir
// This are the main routes of the blog file
// Now it's refactored into an async/await functions
blogRouter.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
  // populate fills the user target with it's id, username, and name
  const allBlogs = yield Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(allBlogs);
}));
blogRouter.post('/', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    // The user is obtained from the middleware that pre-processed request
    const { user } = request;
    // The body is directly modified to add the user ID
    request.body.user = user._id;
    const blog = new Blog(request.body);
    const blogSaved = yield blog.save();
    // Another request to get the user populated automatically
    const blogFromServ = yield Blog.findById(blogSaved)
      .populate('user', { username: 1, name: 1 });
    // The user is modified automatically, it's not necessary to do it manually
    yield saveBlogIDinUserCollection(request.user, blogFromServ);
    // Then it's converted to json and returned to whatever method called POST
    response.status(201).json(blogFromServ);
  } catch (exception) {
    next(exception);
  }
}));
blogRouter.delete('/:id', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    // The token is correct and exists, but it's not known
    // if the user deleting the blog Its the same as the one who created it
    const blogToDelete = yield Blog.findById(request.params.id);
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
    yield Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
}));
blogRouter.put('/:id', (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
  try {
    // request.params is an object made of the arguments in the URL
    // With new : true, it returns the updated object, the default will return the old object
    // and .populate asks the DB to query the ID and return a full user
    const resp = yield Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
      .populate('user', { username: 1, name: 1 });
    response.status(200).json(resp);
  } catch (exception) {
    next(exception);
  }
}));
const saveBlogIDinUserCollection = (userObj, blogToSave) => __awaiter(void 0, void 0, void 0, function* () {
  // The userObj can be used directly without searching again in the DB
  // then it's added to the current blogs in the user blogs
  userObj.blogs = userObj.blogs.concat(blogToSave._id);
  // The response it's not necessary
  yield userObj.save();
});
const formatUserIDInBlogs = userID => JSON.stringify(userID).slice(1, -1);
module.exports = blogRouter;
