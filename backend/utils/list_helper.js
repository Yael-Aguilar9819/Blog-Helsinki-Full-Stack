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
    return (biggestSeen.likes < currBlog.likes ? currBlog : biggestSeen);
  };
  // The starting value is -1 so it can compare correctly
  return arrayOfBlogs.reduce(mostNumberOfLikes, { likes: -1 });
};

const mostBlogs = arrayOfBlogs => {
  const objectAnswer = _.groupBy(arrayOfBlogs, "author");
  console.log(objectAnswer)
  return objectAnswer;
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
