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

module.exports = {
  listOfBlogsToDB,
  blogWithAllProperties,
  blogWithoutLikes,
  blogwithoutUrl,
  blogWithoutTitle,
};
