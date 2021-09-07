const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/user'); // With '..' go back 1 dir
const helperToDB = require('./helper_to_db');
const app = require('../app');
const api = supertest(app);


let userForTests = {}


// This will run before every single test
beforeEach(async () => {
  await User.deleteMany({});

  const usersWithoutHash = helperToDB.listOfUsersToDB;
  const preparedUsers = await helperToDB.hashListOfUsers(usersWithoutHash);
  const usersToAdd = preparedUsers.map(user => new User(user));

  const promiseArrayOfUsers = usersToAdd.map(user => user.save());
  await Promise.all(promiseArrayOfUsers); // This will wait for all the users to be saved to the DB

  // This creates a new user, that will be used for all of the future tests
  // const userWithAllProperties = helperToDB.userWithAllProperties;
  // const resp = 
  //   await api
  //     .post('/api/users')
  //     .send(userWithAllProperties)
  //   // The only thing that really matters it's the ID
  // userForTests.id = resp.body.id // this will retrieve the ID for the use of the tests


  // Gets the blogs array from helper_to_db.js to create an array of blogs
  // then an array of promises, an finally with Promise.all it's run in parallel

  await Blog.deleteMany({});
  const blogsToAdd = helperToDB.listOfBlogsToDB.map(blog => new Blog(blog));
  const promiseArrayOfBlogs = blogsToAdd.map(blog => blog.save());  
  await Promise.all(promiseArrayOfBlogs);

});

describe('GET endpoint for users works correctly', () => {
  test('Returns the number of users properly', async () => {
    const response = await api
      .get('/api/users')
      .expect(200) // Means 'OK'
      .expect('Content-Type', /application\/json/); // Should return this type specifically

    const users = response.body;
    expect(users).toHaveLength(helperToDB.listOfUsersToDB.length);
  });
});

describe('POST endpoint works correctly', () => {
  test('a properly made user adds 1 to the length of the userDB', async () => {
    // This is the user object that will be send to the post endpoint
    const { userWithAllProperties } = helperToDB;

    const well = helperToDB.userWithAllProperties
    console.log(userWithAllProperties)

    // the response it's a no care this time
    await api
      .post('/api/users')
      .send(userWithAllProperties)
      .expect(200);

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
    // The response it's in the format of error:
    // 'User validation failed: username: Path `username` is required.'
  });

  test('If the password is not given, the response should be 400 bad request detailing the error', async () => {
    const userWithoutPassword = helperToDB.userWithoutPasswordParameter;

    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400); // Bad request,
    // The response it's in the format of:
    // 'error: 'User validation failed: passwordHash: Path `passwordHash` is required.'
  });

  test('If username and/or password given are less than 3 characters long, it should return 400 bad request', async () => {
    const userWithoutPassword = helperToDB.userWithoutPasswordParameter;
    userWithoutPassword.password = '2s';

    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400); // Bad request,
    // The response it's in the format of:
    // 'error: 'User validation failed: passwordHash: Path `passwordHash` is required.'

    const resp = await api
      .get('/api/users');

    // This would mean that it didn't add anything
    expect(resp.body).toHaveLength(helperToDB.listOfUsersToDB.length);
  });

  test('The password is just big enough to be handled by the POST router', async () => {
    const userWithoutPassword = helperToDB.userWithoutPasswordParameter;
    userWithoutPassword.password = '2s0';

    await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(200); // it shouldn't be rejected

    const resp = await api
      .get('/api/users');

    // Should be added, that means the + 1
    expect(resp.body).toHaveLength(helperToDB.listOfUsersToDB.length + 1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
