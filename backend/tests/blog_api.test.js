const mongoose = require('mongoose');
const supertest = require('supertest');
const helperToDB = require('./helper_to_db');
const Blog = require('../models/blog'); // With '..' go back 1 dir

const app = require('../app');

const api = supertest(app);

// Gets the blogs array from helper_to_db.js to create an array of blogs
// then an array of promises, an finally with Promise.all it's run in parallel
beforeEach(async () => {
  await Blog.deleteMany({});
  const blogsToAdd = helperToDB.listOfBlogsToDB.map(blog => new Blog(blog));
  const promiseArrayOfBlogs = blogsToAdd.map(blog => blog.save());
  await Promise.all(promiseArrayOfBlogs);
});

// This is a test that just returns checks if the server repsonse is application/json
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

// So we can check if the blogs given through beforeEach are returned correctly
test('Blogs returned are the correct number', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body; // the .body call should be done in another line
  expect(blogs).toHaveLength(4);
});

afterAll(() => {
  mongoose.connection.close();
});
