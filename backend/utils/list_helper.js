const dummy = blogs =>
// ...
  1;


const totalLikes = arrayOfBlogs => {
  const valueSum = (accum, curBlog) => accum + curBlog.likes;
  return arrayOfBlogs.reduce(valueSum, 0)
}

module.exports = {
  dummy,
  totalLikes
};
