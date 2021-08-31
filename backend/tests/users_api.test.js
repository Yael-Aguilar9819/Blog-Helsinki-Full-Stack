const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user'); // With '..' go back 1 dir
const helperToDB = require('./helper_to_db');

const app = require('../app');

const api = supertest(app);

// This will run before every single test
beforeEach(async () => {
  await User.deleteMany({});

  const usersWithoutHash = helperToDB.listOfUsersToDB
  const preparedUsers = await helperToDB.hashListOfUsers(usersWithoutHash);
  const usersToAdd = preparedUsers.map(user => new User(user));

  const promiseArrayOfUsers = usersToAdd.map(user => user.save());
  await Promise.all(promiseArrayOfUsers); // This will wait for all the users to be saved to the DB
});

describe('GET endpoint for users works correctly', () => {
  test('Returns the number of users properly', async () => {
    const response = await api
      .get('/api/users')
      .expect(200) // Means 'OK'
      .expect('Content-Type', /application\/json/); // Should return this type specifically

    const users = response.body;
    expect(users).toHaveLength(3);
  });
});

describe('POST endpoint works correctly', () => {
  test('a properly made user adds 1 to the length of the userDB', async () => {
    // This is the user object that will be send t the post endpoint
    const { userWithAllProperties } = helperToDB;

    // the response it's a no care this time
    await api
      .post('/api/users')
      .send(userWithAllProperties);

    const response = await api
      .get('/api/users');

    const users = response.body;
    expect(users).toHaveLength(4);
  });

  test('If the username is not unique, the creation of new user returns a 400 bad request', async () => {
    // The function brings a random
    // user of the ones given at first to the remoteDB
    const usernameToCopy = await helperToDB.getRandomUser();
    const modifiedUser = helperToDB.userWithAllProperties;
    modifiedUser.username = usernameToCopy; // This will make both usernames the same

    await api
      .post('/api/users')
      .send(modifiedUser)
      .expect(400); // Bad request,

    // the response.body it's in the format of:
    // 'User validation failed: username: Cast to string failed for value "{ ...'
  });

  test('If username is not given, the response should be 400 bad request detailing the error', async () => {
    // There is a preformed user without the username parameter
    const userWithoutusername = helperToDB.userWithoutUsername;

    await api
      .post('/api/users')
      .send(userWithoutusername)
      .expect(400); // Bad request,    
    // The response it's in the format of error: 'User validation failed: username: Path `username` is required.' 
  });

  test('If the password is not given, the response should be 400 bad request detailing the error', async () => {
    // const userWithoutPassword = helperToDB.userWithoutPasswordParameter;

    // await api
    //   .post('/api/users')
    //   .send(userWithoutPassword)
    // .expect(400); // Bad request,

  })

  test('If username and/or password given are less than 3 characters longs, it should return 400 bad request', async () => {

  });
});

afterAll(async () => {
  mongoose.connection.close();
});
