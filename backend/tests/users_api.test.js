const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user'); // With '..' go back 1 dir

const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('GET endpoint for users works correctly', () => {
  test('Returns the number of users properly', async () => {
    const response = await api
      .get('/api/users')
      .expect(200) // Means 'OK'
      .expect('Content-Type', /application\/json/);
    const users = response.body;
    expect(users).toHaveLength(0);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
