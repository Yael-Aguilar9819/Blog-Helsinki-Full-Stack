const supertest = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/blog'); // With '..' go back 1 dir
const User = require('../models/user'); // With '..' go back 1 dir
const helperToDB = require('./helper_to_db');
const app = require('../app');

const api = supertest(app);

let userToken = {};
let numberOfBlogsAdded = 0;

// This will be the selected user in some tests
// added it to increase maintainability
const selectedUser = 0;
let userID = 0;

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
  // Converted to String so it can be compared more easily

  userID = resp[selectedUser]._id.toString();

  // This reuses the first user added to create a new JWT
  const userLogin = await api
    .post('/api/login')
    .send(helperToDB.listOfUsersToDB[selectedUser])
    .expect(200);

  userToken = userLogin.body.token;

  // Gets the blogs array from helper_to_db.js to create an array of blogs
  // then an array of promises, an finally with Promise.all it's run in parallel
  await Blog.deleteMany({});
  const promiseArrayOfBlogs = helperToDB.getArrayOfInitialBlogPromises(userID);
  numberOfBlogsAdded = promiseArrayOfBlogs.length;
  const blogsAddedToDB = await Promise.all(promiseArrayOfBlogs);
  // This adds all the newly saved blogs to the user object
  // that is user through the tests here
  await helperToDB.addBlogsToUser(userID, blogsAddedToDB);
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
    // This line sends the new blog, but doesn't care for it's response
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userToken}`)
      .send(newBlog)
      .expect(201);

    // Then we get the blogs in the DB
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    // 1 is added to signify that the array is now 1 item larger
    expect(blogs).toHaveLength(helperToDB.listOfBlogsToDB.length + 1);
  });

  test('The object returned from the RemoteDB its the same as the one sent', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userToken}`)
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

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${userToken}`)
      .send(blogWithoutLikes);

    const blogResponseNoLikes = response.body;
    // The default if likes are not given, should be 0
    expect(blogResponseNoLikes.likes).toEqual(0);
  });

  test('if title or url are missing, returns a 400 bad request response', async () => {
    const blogNoURL = helperToDB.blogwithoutUrl;
    const blogNoTitle = helperToDB.blogWithoutTitle;

    // Checks both characteristis, one after the other
    await api.post('/api/blogs')
      .send(blogNoURL)
      .set('Authorization', `bearer ${userToken}`)
      .expect(400);

    await api.post('/api/blogs')
      .send(blogNoTitle)
      .set('Authorization', `bearer ${userToken}`)
      .expect(400);
  });
});

describe('Delete/:id endpoint of blogs works properly', () => {
  test('Succeeds at deleting with status code 204 if blog id is valid', async () => {
    // this helper method retrieves a random blog of the remoteDB
    const blogToDelete = await helperToDB.getRandomBlog();

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(204); // 204 means that the operation went through
  });

  test('The deleted blog is no longer in the user blogs section', async () => {
    const firstResp = await api
      .get('/api/users/');

    // it will create an array of a single object with the creator of blogs
    const creatorOfBlogs = firstResp.body.filter(userObj => userObj.id === userID)[0];
    // This gets the first blog ID that the user created, to delete it
    const idOfFirstBlog = creatorOfBlogs.blogs[0].id;

    await api
      .delete(`/api/blogs/${idOfFirstBlog}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(204); // 204 means that the operation went through

    const secondResp = await api
      .get('/api/users/');

    const userBlogsAfterDel = secondResp.body.filter(userObj => userObj.id === userID)[0].blogs;

    // Should be 1 less than the blogs added initially
    expect(userBlogsAfterDel).toHaveLength(numberOfBlogsAdded - 1);
  });

  test('The Deleted blog is no longer present in the DB, and its ID disappeared', async () => {
    const blogToDelete = await helperToDB.getRandomBlog();

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(204); // 204 means that the operation went through

    const afterDeletedBlog = await helperToDB.blogsInRemoteDB();
    // One was deleted, so it should be one less that the origin array
    expect(afterDeletedBlog.length).toEqual(helperToDB.listOfBlogsToDB.length - 1);

    const appearedInRemoteDB = afterDeletedBlog.reduce((IDAppeared, currentBlog) => {
      if (IDAppeared) { // Means that it's true
        return true;
      } if (currentBlog.id === blogToDelete.id) {
        // This would mean that one of the remote blogs has the same ID as the one deleted
        return true;
      }
      return false;
    }, false);

    expect(appearedInRemoteDB).toEqual(false);
  });

  test('Fails at deleting a non-existing blog', async () => {
    const nonExistingblogID = '29j239182j';
    await api.delete(`/api/blogs/${nonExistingblogID}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(400); // this means that the middleware catched the exception
  });

  test('User can delete a blog created by himself', async () => {
    // We just copy the object of the user that created those blogs
    const resp = await api.get('/api/users/');
    // This will get the ID of the first blog of the selected user
    // So it can be deleted later

    const creatorOfBlogs = resp.body.filter(userObj => userObj.id === userID)[0];
    const idOfFirstBlog = creatorOfBlogs.blogs[0].id;

    // Now It's neccesary to send a token to delete ANY blog
    await api
      .delete(`/api/blogs/${idOfFirstBlog}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(204);
  });

  test('Trying to delete a blog with another user returns an error', async () => {
    // It's not the creator, it's going to be the one after the blog creator
    const userCreator = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[selectedUser + 1]));

    const respToken = await api
      .post('/api/login')
      .send(userCreator)
      .expect(200);

    const nonCreatorToken = respToken.body.token;

    const respUsers = await api.get('/api/users/');
    // This will get the ID of the first blog of the user that created those blogs
    // So it can be deleted later

    const creatorOfBlogs = respUsers.body.filter(userObj => userObj.id === userID)[0];
    const idOfFirstBlog = creatorOfBlogs.blogs[0].id;

    const resp = await api
      .delete(`/api/blogs/${idOfFirstBlog}`)
      .set('Authorization', `bearer ${nonCreatorToken}`)
      .expect(401);

    // In the response body should be an error property
    expect(!!resp.body.error).toEqual(true);
  });

  test('Trying to delete a blog with an incorrect token returns an error', async () => {
    const respUsers = await api.get('/api/users/');
    // This will get the ID of the first blog of the user that created those blogs
    // So it can be deleted later

    const creatorOfBlogs = respUsers.body.filter(userObj => userObj.id === userID)[0];
    const idOfFirstBlog = creatorOfBlogs.blogs[0].id;

    const resp = await api
      .delete(`/api/blogs/${idOfFirstBlog}`)
      .set('Authorization', 'bearer randomTokenObviouslyNotValid')
      .expect(401);

    // This will check that there is a characteristic called 'error' in the response
    expect(!!resp.body.error).toEqual(true);
  });

  test('Trying to delete a blog that doesnt exist anymore returns an error', async () => {
    // We just copy the object of the user that created those blogs
    const resp = await api.get('/api/users/');

    // This will get the ID of the first blog of the selected user
    const creatorOfBlogs = resp.body.filter(userObj => userObj.id === userID)[0];
    const idOfFirstBlog = creatorOfBlogs.blogs[0].id;
    
    // Now It's neccesary to send a token to delete ANY blog
    await api
      .delete(`/api/blogs/${idOfFirstBlog}`)
      .set('Authorization', `bearer ${userToken}`)
      .expect(204);
    
    // Should be deleted already, so it's going to
    // Respond with a 404
    const failedResp =
      await api
        .delete(`/api/blogs/${idOfFirstBlog}`)
        .set('Authorization', `bearer ${userToken}`)
        .expect(404); // couldn't be found

    console.log(failedResp.body)
    // this means that an object with an error exists in the response
    expect(!!failedResp.body.error).toEqual(true);

  })
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

    // This line sends the new blog,
    const resp = await api
      .post('/api/blogs')
      .send(newBlogWithUserID)
      .set('Authorization', `bearer ${userToken}`)
      .expect(201);

    const blogFromServ = resp.body;
    // This will get the user ID returned
    const userIdReturnedObject = await User.findById(blogFromServ.user);
    // Just asking for a true value, instead of a null if it doesn't exist
    expect(!!userIdReturnedObject).toEqual(true);
  });

  // The test 'A blog without an user portion will be rejected with a 400 bad request'
  // Was deleted because the user it's now given by the token

  test('Blog with an invalid userID will return a 400 bad request', async () => {
    const newBlogWithoutUserID = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));

    // The token contains the userID so an unknown token should be given
    await api
      .post('/api/blogs')
      .send(newBlogWithoutUserID) // This sends the user token with it
      .set('Authorization', 'bearer unknownTokenForThisUser8238231')
      .expect(401); // 400 Una
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
    const listOfBlogs = resp.body.filter(userObj => userObj.id === userID)[0].blogs;

    expect(listOfBlogs).toHaveLength(numberOfBlogsAdded);
  });

  test('After the user adds a new blog, its reflected in its user blog portion adding one', async () => {
    const resp = await api
      .get('/api/users')
      .expect(200);

    const listOfUserBlogs = resp.body.filter(userObj => userObj.id === userID)[0].blogs;
    // So the same number of blogs are returned from the test
    expect(listOfUserBlogs).toHaveLength(numberOfBlogsAdded);

    const newBlog = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));

    // This line sends the new blog, but doesn't care for it's response
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${userToken}`)
      .expect(201); // 201 Created

    const secondResp = await api
      .get('/api/users')
      .expect(200);

    const listOfBlogs = secondResp.body.filter(userObj => userObj.id === userID)[0].blogs;
    expect(listOfBlogs).toHaveLength(numberOfBlogsAdded + 1);
  });
});

describe('Login works appropriately', () => {
  test('Login as an existing user returns a JWT token', async () => {
    // Deep copy of the first user
    // Although it doesn't matter the number, all of the list went inside the remoteDB
    const userWithPass = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));

    const resp = await api
      .post('/api/login')
      .send(userWithPass)
      .expect(200);

    // This will check that each of the categories exist in the object returned
    expect(!!resp.body.username).toEqual(true);
    expect(!!resp.body.token).toEqual(true);
    expect(!!resp.body.name).toEqual(true);
  });

  test('Trying to log with an incorrect password returns an error', async () => {
    const userWithWrongPass = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));
    // The pass will be modified with an unknown one
    userWithWrongPass.password = 'Truly Not A Correct Password';

    const resp = await api
      .post('/api/login')
      .send(userWithWrongPass)
      .expect(401); // 401 Unauthorized

    // this means that an object with an error exists
    expect(!!resp.body.error).toEqual(true);
  });

  test('Trying to log without a password returns an error', async () => {
    const userWithNoPass = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));
    // The pass will be modified with an unknown one
    delete userWithNoPass.password;

    const resp = await api
      .post('/api/login')
      .send(userWithNoPass)
      .expect(401); // 401 Unauthorized

    // this means that an object with an error exists
    expect(!!resp.body.error).toEqual(true);
  });

  test('Trying to log with an username that doesnt exist returns an error describing it', async () => {
    const userWithInexistantUsername = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));
    // The pass will be modified with an unknown one
    userWithInexistantUsername.username = "This definitely doesn't exist";

    const resp = await api
      .post('/api/login')
      .send(userWithInexistantUsername)
      .expect(401); // 401 Unauthorized

    // this means that an object with an error exists
    expect(!!resp.body.error).toEqual(true);
  });

  test('Trying to log without any data returns an error', async () => {
    const resp = await api
      .post('/api/login')
      .expect(401); // 401 Unauthorized

    expect(!!resp.body.error).toEqual(true);
  });
});

describe('JWT is produced and processed correctly', () => {
  test('A successful login returns a JWT token', async () => {
    // A valid user that exists
    const userWithPass = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));

    const resp = await api
      .post('/api/login')
      .send(userWithPass)
      .expect(200);

    // This verifies that the object returned inside .body contains a property called toke
    expect(!!resp.body.token).toEqual(true);
  });

  test('An unsuccessful login returns a 401 code error', async () => {
    // Modified an existing user to make it unknown to the DB
    const userWithDifferentPassAndName = JSON.parse(JSON.stringify(helperToDB.listOfUsersToDB[0]));
    userWithDifferentPassAndName.username = 'UnknownUser';
    userWithDifferentPassAndName.password = 'WithAnUnknownPass';

    const resp = await api
      .post('/api/login')
      .send(userWithDifferentPassAndName)
      .expect(401); // 401 Unauthorized

    // Converts the object into a boolean value
    // and verifies that the object has a property called error
    expect(!!resp.body.error).toEqual(true);
  });

  test('Using a valid token in POST request returns a successful response', async () => {
    // A random new blog
    const newBlog = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));

    // This line sends the new blog, but doesn't care for it's response
    const resp = await api
      .post('/api/blogs')
      .send(newBlog) // Then a valid JWT token is used, includes user info
      .set('Authorization', `bearer ${userToken}`)
      .expect(201); // 201 Created

    // Checks that the object has a property called author
    expect(!!resp.body.author).toEqual(true);
  });

  test('Using a totally invalid token in POST request returns an unauthorized error response', async () => {
    // A random new blog
    const newBlog = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));

    // An incorrect token is sent
    const resp = await api
      .post('/api/blogs')
      .send(newBlog) // Then a valid JWT token is used, includes user info
      .set('Authorization', 'bearer DefinitelyNotAGreatToken')
      .expect(401); // 401 Unauthorized

    // Checks that the object has a property called error
    expect(!!resp.body.error).toEqual(true);
  });

  test('Using a semi-invalid token in POST request returns an unauthorized error response', async () => {
    // A random new blog
    const newBlog = JSON.parse(JSON.stringify(helperToDB.blogWithAllProperties));
    // The token is basically the same, changing the last 2 characters
    const modifiedToken = `${userToken.substring(0, userToken.length - 2)}2B`;

    // An incorrect token is sent
    const resp = await api
      .post('/api/blogs')
      .send(newBlog) // Then a valid JWT token is used, includes user info
      .set('Authorization', `bearer ${modifiedToken}`)
      .expect(401); // 401 Unauthorized

    // Checks that the object has a property called error
    expect(!!resp.body.error).toEqual(true);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
