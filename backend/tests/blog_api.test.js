const mongoose = require('mongoose');
const supertest = require('supertest');
const helperToDB = require('./helper_to_db');
const Blog = require('../models/blog'); // With '..' go back 1 dir
const User = require('../models/user');


const app = require('../app');

const api = supertest(app);

let userForTests = {}

// This creates a new user, that will be used for all of the future tests
beforeAll(async () => {
  await User.deleteMany({});
  
  const userWithAllProperties = helperToDB.userWithAllProperties;
  const resp = 
    await api
      .post('/api/users')
      .send(userWithAllProperties)
    // The only thing that really matters it's the ID
  userForTests.id = resp.body.id
})

// Gets the blogs array from helper_to_db.js to create an array of blogs
// then an array of promises, an finally with Promise.all it's run in parallel
beforeEach(async () => {
  await Blog.deleteMany({});
  const blogsToAdd = helperToDB.listOfBlogsToDB.map(blog => new Blog(blog));
  const promiseArrayOfBlogs = blogsToAdd.map(blog => blog.save());  
  await Promise.all(promiseArrayOfBlogs);
});

describe('The basic GET endpoint works properly', () => {
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

describe('Post request works according to spec', () => {
  // It's reference it's given to an object with a shorter name
  const newBlog = helperToDB.blogWithAllProperties;

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

    // Then each of the original properties it's checked for equality
    const hasSameCatAsBaseObj = helperToDB.ObjectsHasEqualCategories(newBlog, blogFromServer);
    expect(hasSameCatAsBaseObj).toEqual(false);
  });

  test('if the likes property is missing from the request, it will default to 0', async () => {
    // The new blog is created without likes, the reference is copied from the helper file
    const { blogWithoutLikes } = helperToDB;

    const response = await api.post('/api/blogs').send(blogWithoutLikes);
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
      .expect(400);

    await api.post('/api/blogs')
      .send(blogNoTitle)
      .expect(400);
  });
});

describe('Delete/:id endpoint works properly', () => {
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

  describe('The update endpont works', () => {
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

afterAll(() => {
  mongoose.connection.close();
});
