const Blog = require('../models/blog');
const User = require('../models/user');

const listOfBlogsToDB = [
  {
    title: 'Typescript patterns',
    author: 'Michael Chan',
    url: 'https://Typescriptpatterns.com/',
    likes: 3,
  },
  {
    title: 'Learning to test',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/learning-to-test.html',
    likes: 5,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 3,
  },
  {
    title: 'Programming Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Programming-Considered-Harmful.html',
    likes: 9,
  },
];

const blogWithAllProperties = {
  title: 'New Blog 232',
  author: 'Josh cracker',
  url: 'www.idontknow.com',
  likes: 13,
};

const blogWithoutLikes = {
  title: 'New Article',
  author: 'Nyan-kun',
  url: 'www.TopCat2001.com',
};

const blogwithoutUrl = { // The new blog is created without likes
  title: 'Covid is no more',
  author: 'Mr. T',
  likes: 5,
};

const blogWithoutTitle = {
  author: 'Super blogger',
  url: 'www.blogsnainai.com',
  likes: 1,
};

// So it's less cumebrsome to access all of the blogs currently in the remote DB
const blogsInRemoteDB = async () => {
  const blogs = await Blog.find({});
  // Returns an array of blogs
  return blogs.map(blog => blog.toJSON());
};

const getRandomBlog = async () => {
  const arrayOfBlogs = await blogsInRemoteDB();
  const randomBlogIndex = Math.floor(Math.random() * arrayOfBlogs.length);

  return arrayOfBlogs[randomBlogIndex];
};

const ObjectsHasEqualCategories = (baseObject, objectToCompare) => {
  let isThereADifference = false;
  Object.keys(baseObject).forEach(property => { //
    if (objectToCompare[property] !== baseObject[property]) {
      isThereADifference = true;
    }
  });
  return isThereADifference;
};

const usersInRemoteDB = async () => {
  const users = await User.find({});
  // Returns an array of users with all it's characteristics
  return users.map(user => user.toJSON());
};

const getRandomUser = async () => {
  const arrayOfUsers = await usersInRemoteDB();
  const randomUserIndex = Math.floor(Math.random() * arrayOfUsers.length);

  return arrayOfUsers[randomUserIndex];
};

const listOfUsersToDB = [
  {
    username: 'The typescriper',
    name: 'No one has this name',
    password: 'welp i dont have an idea',
  },
  {
    username: 'the javaGod',
    name: 'Many names here',
    password: 'some well done pass',
  },
  {
    username: 'Patterns of conquest',
    name: 'may be unique',
    password: 'well thought pass',
  },
];

// This shows the different users to be used in various parts of the test
const userWithAllProperties = {
  username: 'user-root-test',
  name: 'Well made test user',
  password: 'pass not so safe',
};

const userWithoutUsername = {
  name: 'not so well made test user',
  password: 'pass necessary',
};

const userWithoutNameParameter = {
  username: 'original username',
  password: 'pass not so safe',
};

const userWithoutPasswordParameter = {
  username: 'pass without username nor name',
  name: 'name given totally correct',
};

module.exports = {
  listOfBlogsToDB,
  blogWithAllProperties,
  blogWithoutLikes,
  blogwithoutUrl,
  blogWithoutTitle,
  blogsInRemoteDB,
  getRandomBlog,
  ObjectsHasEqualCategories,
  usersInRemoteDB,
  getRandomUser,
  listOfUsersToDB,
  userWithAllProperties,
  userWithoutUsername,
  userWithoutNameParameter,
  userWithoutPasswordParameter,
};
