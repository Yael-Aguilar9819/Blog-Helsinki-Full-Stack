const dummy = blogs => 1;

const _ = require('lodash');

const totalLikes = arrayOfBlogs => {
  // Using an array of blogs with reduce now its totally functional
  const valueSum = (accum, curBlog) => accum + curBlog.likes;
  return arrayOfBlogs.reduce(valueSum, 0); // The starting value is 0 so it works corcectly
};

const favoriteBlog = arrayOfBlogs => { // Using reduce it's not very efficient but its immutable
  // Now it's a single line, and much clearer
  // const mostNumberOfLikes = (biggestSeen, currBlog) => {
  //   if (!biggestSeen.likes) return currBlog; // This exploits that undefined is always false
  //   return (biggestSeen.likes < currBlog.likes ? currBlog : biggestSeen);
  // };
  return arrayOfBlogs.reduce(toSumToACharacteristic({}, {}, "likes"), {})
  // return arrayOfBlogs.reduce(mostNumberOfLikes, {});
};

// Returns an object with the author name that has the most blogs
const mostBlogs = arrayOfBlogs => {
  // This groups by each of the authors
  const groupedByNumberOfBlogsByAuthor = _
    .groupBy(arrayOfBlogs, 'author');

  const authorWithMostBlogs = Object.entries(groupedByNumberOfBlogsByAuthor)
  // [0] gets the name
  // [1].length gets the array length of blogs
    .map(author => ({ author: author[0], blogs: author[1].length }))
    .reduce(toSumToACharacteristic({}, {}, "blogs"), {});
    // .reduce((mostProlificSeen, currAuthor) => {
    //   if (!mostProlificSeen.blogs) return currAuthor; // This exploits that undefined is always false
    //   return (mostProlificSeen.blogs < currAuthor.blogs ? currAuthor : mostProlificSeen);
    // }, {});
  return authorWithMostBlogs;
};

const toSumToACharacteristic = (baseObject, currentObject, charaToCount) => {
  const functionToReduce = (baseObject, currentObject) => { 
    if (!baseObject.charaToCount) return currentObject;
    return (baseObject.charaToCount < currentObject.charaToCount ? currentObject : baseObject);
  }
  return functionToReduce
}



const listOfBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

console.log(favoriteBlog(listOfBlogs))

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
