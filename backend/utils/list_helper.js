const dummy = blogs => 1;

const _ = require('lodash');

const totalLikes = arrayOfBlogs => {
  // Using an array of blogs with reduce now its totally functional
  const valueSum = (accum, curBlog) => accum + curBlog.likes;
  return arrayOfBlogs.reduce(valueSum, 0); // The starting value is 0 so it works corcectly
};

const favoriteBlog = arrayOfBlogs => { // Using reduce it's not very efficient but its immutable
  // Now it's a single line, and much clearer
  const mostNumberOfLikes = (biggestSeen, currBlog) => {
    if (!biggestSeen.likes) return currBlog // This exploits that undefined is always false
    return (biggestSeen.likes < currBlog.likes ? currBlog : biggestSeen);
  };
  // The starting value is -1 so it can compare correctly
  return arrayOfBlogs.reduce(mostNumberOfLikes, {});
};

//Returns an object with the author name that has the most blogs
const mostBlogs = arrayOfBlogs => {
  //This groups by each of the authors
  const groupedByNumberOfBlogsByAuthor = _
    .groupBy(arrayOfBlogs, "author")

  const authorWithMostBlogs = 
    Object.entries(groupedByNumberOfBlogsByAuthor)
      // [0] gets the name
      // [1].length gets the array length of blogs 
    .map(author => {return {author: author[0], blogs: author[1].length}})
    .reduce((mostProlificSeen, currAuthor) => {
      if (!mostProlificSeen.blogs) return currAuthor //This exploits that undefined is always false
      return (mostProlificSeen.blogs < currAuthor.blogs ? currAuthor : mostProlificSeen);
    }, {})
  return authorWithMostBlogs;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
