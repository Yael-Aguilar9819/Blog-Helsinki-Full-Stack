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
  expect(blogs).toHaveLength(helperToDB.listOfBlogsToDB.length);
});

// Now we can verify that the id parameter is changed to "id" from "_id"
test('Blogs have the id parameter defined', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  expect(blogs[0].id).toBeDefined();
});

describe('Post request works according to spec', () => {
  const newBlog = {
    title: 'New Blog 232',
    author: 'Josh cracker',
    url: 'www.idontknow.com',
    likes: 13,
  };

  test('The remoteDB adds 1 to the length after adding a new blog post', async () => {
    // This line sends the new blog, but doesn't care for it's response
    await api.post('/api/blogs').send(newBlog);

    // Then we get the blogs in the DB
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    // 1 is added to signify that the array is now 1 item larger
    expect(blogs).toHaveLength(helperToDB.listOfBlogsToDB.length + 1);
  });

  test('The object returned from the RemoteDB its the same as the one sent', async () => {
    const response = await api.post('/api/blogs').send(newBlog);
    const blogFromServer = response.body;

    // Then each of the relevant categories it's checked for equality
    const results = Object.keys(newBlog).map(property => {
      expect(blogFromServer[property]).toEqual(newBlog[property])}
      );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
