const supertest = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/blog'); // With '..' go back 1 dir
const User = require('../models/user'); // With '..' go back 1 dir
const helperToDB = require('./helper_to_db');
const app = require('../app');

const api = supertest(app);

let userIDForTests = {};
let numberOfBlogsAdded = 0;

// This will be the selected user in some tests
// added it to increase maintainability
const selectedUser = 0;

// This will run before every single test
beforeEach(async () => {
  await User.deleteMany({});

  const usersWithoutHash = helperToDB.listOfUsersToDB;
  const preparedUsers = await helperToDB.hashListOfUsers(usersWithoutHash);
  const usersToAdd = preparedUsers.map(user => new User(user));

  const promiseArrayOfUsers = usersToAdd.map(user => user.save());
  // This will wait for all the users to be saved to the DB
  const resp = await Promise.all(promiseArrayOfUsers);
  // This gets the ID from the first user, to be used everytime
  userIDForTests = resp[selectedUser]._id;

  // Gets the blogs array from helper_to_db.js to create an array of blogs
  // then an array of promises, an finally with Promise.all it's run in parallel
  await Blog.deleteMany({});
  const promiseArrayOfBlogs = helperToDB.getArrayOfInitialBlogPromises(userIDForTests);
  numberOfBlogsAdded = promiseArrayOfBlogs.length;
  const blogsAddedToDB = await Promise.all(promiseArrayOfBlogs);
  // This adds all the newly saved blogs to the user object
  // that is user through the tests here
  await helperToDB.addBlogsToUser(userIDForTests, blogsAddedToDB);
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

describe('POST endpoint of users endpoint works correctly', () => {
  test('a properly made user adds 1 to the length of the userDB', async () => {
    // This is the user object that will be send to the post endpoint
    const { userWithAllProperties } = helperToDB;

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

describe('The basic GET endpoint of /api/blogs/ works properly', () => {
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
});

describe('Post request of /api/blogs/ works according to spec', () => {
  // It's reference it's given to an object with a shorter name
  // Now it's deep cloned
  const newBlog = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));

  test('The remoteDB adds 1 to the length after adding a new blog post', async () => {
    // Add the user id to the blog properties, it's needed to add it each time because it changes
    newBlog.userId = userIDForTests;
    // This line sends the new blog, but doesn't care for it's response
    await api
      .post('/api/blogs')
      .send(newBlog);

    // Then we get the blogs in the DB
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    // 1 is added to signify that the array is now 1 item larger
    expect(blogs).toHaveLength(helperToDB.listOfBlogsToDB.length + 1);
  });

  test('The object returned from the RemoteDB its the same as the one sent', async () => {
    newBlog.userId = userIDForTests;
    const response = await api
      .post('/api/blogs')
      .send(newBlog);

    const blogFromServer = response.body;
    // Then each of the original properties it's checked for equality
    const hasSameCatAsBaseObj = helperToDB.ObjectsHaveDifferentValuesOrCats(
      newBlog, blogFromServer,
    );
    expect(hasSameCatAsBaseObj).toEqual(false);
  });

  test('if the likes property is missing from the request, it will default to 0', async () => {
    // The new blog is created without likes, the reference is copied from the helper file
    const { blogWithoutLikes } = helperToDB;
    blogWithoutLikes.userId = userIDForTests;

    const response = await api
      .post('/api/blogs')
      .send(blogWithoutLikes);

    const blogResponseNoLikes = response.body;
    // The default if likes are not given, should be 0
    expect(blogResponseNoLikes.likes).toEqual(0);
  });

  test('if title or url are missing, returns a 400 bad request response', async () => {
    const blogNoURL = helperToDB.blogwithoutUrl;
    const blogNoTitle = helperToDB.blogWithoutTitle;
    blogNoURL.userId = userIDForTests;
    blogNoTitle.userId = userIDForTests;

    // Checks both characteristis, one after the other
    await api.post('/api/blogs')
      .send(blogNoURL)
      .expect(400);

    await api.post('/api/blogs')
      .send(blogNoTitle)
      .expect(400);
  });
});

describe('Delete/:id endpoint of blogs works properly', () => {
  test('Succeeds at deleting with status code 204 if blog id is valid', async () => {
    // this helper method retrieves a random blog of the remotDB
    const blogToDelete = await helperToDB.getRandomBlog();

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204); // 204 means that the operation went through
  });

  test('The Deleted blog is no longer present in the DB, and its ID disappeared', async () => {
    const blogToDelete = await helperToDB.getRandomBlog();

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204); // 204 means that the operation went through

    const afterDeletedBlog = await helperToDB.blogsInRemoteDB();
    // One was deleted, so it should be one less that the origin array
    expect(afterDeletedBlog.length).toEqual(helperToDB.listOfBlogsToDB.length - 1);

    const appearedInRemoteDB = afterDeletedBlog.reduce((IDAppeared, currentBlog) => {
      if (IDAppeared) { // Means that it's true
        return true;
      } if (currentBlog.id === blogToDelete.id) {
        return true; // This would mean that one of the remote blogs has
      }
      return false;
    }, false);

    expect(appearedInRemoteDB).toEqual(false);
  });

  test('Fails at deleting a non-existing blog', async () => {
    const nonExistingblogID = '29j239182j';
    await api.delete(`/api/blogs/${nonExistingblogID}`)
      .expect(400); // this means that the middleware catched the exception
  });

  describe('The update endpoint works', () => {
    test('It returns a correct response status from a known blog', async () => {
      const blogToUpdate = await helperToDB.getRandomBlog();
      blogToUpdate.title = 'Welp'; // This is justa  simple variation

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200);
    });

    test('Returns the blog now modified', async () => {
      const blogToUpdate = await helperToDB.getRandomBlog();
      blogToUpdate.title = 'New title pls'; // It gets slighly modified

      const updatedRemoteBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200);

      // It has to be cast to String, so it's the same type
      // As the one returned from the DB
      blogToUpdate.user = String(blogToUpdate.user);
      expect(updatedRemoteBlog.body).toEqual(blogToUpdate);
    });

    test('After the update, the remoteDB has the same number of blogs', async () => {
      const blogToUpdate = await helperToDB.getRandomBlog();
      blogToUpdate.title = 'Welp'; // This is just a simple variation

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate);

      const blogs = await api
        .get('/api/blogs');

      // So its confirmed that it has the same number of blogs in the remoteDB
      expect(blogs.body).toHaveLength(helperToDB.listOfBlogsToDB.length);
    });
  });
});

describe('user portion in Blogs works appropriately', () => {
  test('GET endpoint returns a section with user data', async () => {
    const resp = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // The double !! makes it act as a boolean, so if it's not a falsy value, will be true
    expect(!!resp.body[0].user).toEqual(true);
  });

  test('After creating a new blog, a valid blog with a valid userID is returned', async () => {
    const newBlogWithUserID = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));

    newBlogWithUserID.userId = userIDForTests; // Add the user id to the blog properties

    // This line sends the new blog,
    const resp = await api
      .post('/api/blogs')
      .send(newBlogWithUserID)
      .expect(201);

    const blogFromServ = resp.body;
    // This will get the user ID returned
    const userIdReturnedObject = await User.findById(blogFromServ.user);
    // Just asking for a true value, instead of a null if it doesn't exist
    expect(!!userIdReturnedObject).toEqual(true);
  });

  test('A blog without an user portion will be rejected with a 400 bad request', async () => {
    const newBlogWithoutUserID = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));
    // this time the userID its not added, and also it's deep copied
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUserID)
      .expect(400);
    // the response.body should be in the format of
    // "{ error: 'Blog validation failed: user: Path `user` is required.' }"
  });

  test('Blog with an invalid userID will return a 400 bad request', async () => {
    const newBlogWithoutUserID = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));
    newBlogWithoutUserID.userId = '023213Gibberish-IDsdsa'; // This is a wrong ID

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUserID)
      .expect(400); // 400 Bad Request
    // the response.body should be in the format of "{ error: 'malformatted id' }"
  });
});

describe('Blog portion in api/users Endpoint works according to spec', () => {
  test('GET endpoint returns a section with the blogs the user has', async () => {
    const resp = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // So it should have the same number of blogs as the ones added by the beforeEach
    expect(resp.body[selectedUser].blogs).toHaveLength(numberOfBlogsAdded);
  });

  test('After the user adds a new blog, its reflected in its user blog portion adding one', async () => {
    const resp = await api
      .get('/api/users')
      .expect(200);

    // So the same number of blogs are returned from the test
    expect(resp.body[selectedUser].blogs).toHaveLength(numberOfBlogsAdded);

    const newBlog = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));
    newBlog.userId = userIDForTests;
    // This line sends the new blog, but doesn't care for it's response
    await api
      .post('/api/blogs')
      .send(newBlog);

    const SecondResp = await api
      .get('/api/users')
      .expect(200);

    expect(SecondResp.body[selectedUser].blogs).toHaveLength(numberOfBlogsAdded + 1);
  });
});

describe('Login works appropriately', () => {
  test('Login as an existing user returns a JWT token', async () => {
    //Deep copy of the first user
    // Although it doesn't matter the number, all of the list went inside the remoteDB
    const userWithPass = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));

    const resp = await api
      .post('/api/login')
      .send(userWithPass)
      .expect(200)

    // This will check that each of the categories exist in the object returned
    expect(!!resp.body.username).toEqual(true)
    expect(!!resp.body.token).toEqual(true)
    expect(!!resp.body.name).toEqual(true)
  })

  test('Trying to log with an incorrect password returns an error', async () => {

  })

  test('Trying to log without a password returns an error', async () => {

  })

  test('Trying to log with an username that doesnt exist returns an error', async () => {

  })

  test('Trying to log without any data returns an error', async () => {

  })
})

afterAll(async () => {
  await mongoose.connection.close();
});
