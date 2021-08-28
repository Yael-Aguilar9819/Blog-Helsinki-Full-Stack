const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user'); // With '..' go back 1 dir
const helperToDB = require('./helper_to_db');

const app = require('../app');

const api = supertest(app);

// This will run before every single test
beforeEach(async () => {
  await User.deleteMany({});
});

describe('GET endpoint for users works correctly', () => {
  test('Returns the number of users properly', async () => {
    const response = await api
      .get('/api/users')
      .expect(200) // Means 'OK'
      .expect('Content-Type', /application\/json/); // Should return this type specifically

    const users = response.body;
    expect(users).toHaveLength(0);
  });
});

describe('POST endpoint works correctly', () => {
  test('a properly made user adds 1 to the length of the userDB', async () => {
    // This is the user object that will be send t the post endpoint
    const userWithAllProperties = {
      username: 'user-root-test',
      name: 'Well made test user',
      password: 'pass not so safe',
    };

    // we dont' really care for the responde this time
    await api
      .post('/api/users')
      .send(userWithAllProperties);

    const response = await api
      .get('/api/users');

    const users = response.body;
    expect(users).toHaveLength(1);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
