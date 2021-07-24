const dummy = blogs =>
// ...
  1;

const totalLikes = arrayOfBlogs => {
  //Using an array of blogs with reduce now its totally functional
  const valueSum = (accum, curBlog) => accum + curBlog.likes;
  return arrayOfBlogs.reduce(valueSum, 0) // The starting value is 0 so it works corcectly
}

const favoriteBlog = arrayOfBlogs => {
  const mostNumberOfLikes = (biggestSeen, currBlog) => biggestSeen.likes > currBlog.likes ? null : biggestSeen = currBlog;
  return arrayOfBlogs.reduce(mostNumberOfLikes) // The starting value is 0 so it works corcectly
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
