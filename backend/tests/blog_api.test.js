const mongoose = require('mongoose');
const supertest = require('supertest');
const helper_to_db = require('./helper_to_db');
const Blog = require('../models/blog'); // With '..' go back 1 dir

const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogsToAdd = helper_to_db.listOfBlogsToDB.map(blog => new Blog(blog))
  const promiseArrayOfBlogs = blogsToAdd.map(blog => blog.save())
  await Promise.all(promiseArrayOfBlogs);
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Blogs are the correct number', async () => {
  const blogs = await api.get('api/blogs');
  console.log(blogs)
  expect(blogs.length).toHaveLength(4)
})

afterAll(() => {
  mongoose.connection.close();
});
