const dummy = blogs => 1;

const _ = require('lodash');

const totalLikes = arrayOfBlogs => {
  // Using an array of blogs with reduce now its totally functional
  const valueSum = (accum, curBlog) => accum + curBlog.likes;
  return arrayOfBlogs.reduce(valueSum, 0); // The starting value is 0 so it works corcectly
};

const favoriteBlog = arrayOfBlogs => { // Using reduce it's not very efficient but its immutable
  // Now it's a single line, and much clearer
  return arrayOfBlogs.reduce(toSumToACharacteristic("likes"), {})
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
    .reduce(toSumToACharacteristic("blogs"), {});
  return authorWithMostBlogs;
};

// This function is a HOF that return a function suitable for reduce
const toSumToACharacteristic = (charaToCount) => {
  const functionToReduce = (baseObject, currentObject) => { // Suitable for reduce
    if (!baseObject[charaToCount]) return currentObject; // This exploits that the undefined it's always false
    return (baseObject[charaToCount] < currentObject[charaToCount] ? currentObject : baseObject);
  }
  return functionToReduce
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
