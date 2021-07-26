const dummy = blogs =>
// ...
  1;

const totalLikes = arrayOfBlogs => {
  //Using an array of blogs with reduce now its totally functional
  const valueSum = (accum, curBlog) => accum + curBlog.likes;
  return arrayOfBlogs.reduce(valueSum, 0) // The starting value is 0 so it works corcectly
}

const favoriteBlog = arrayOfBlogs => { //Using reduce it's now not very efficient
  //But its immutable
  const mostNumberOfLikes = (biggestSeen, currBlog) => {
    //it's a simple if else, to be changed into a ternary single line
    if (biggestSeen.likes < currBlog.likes) {return currBlog}
    return biggestSeen;
  };
  return arrayOfBlogs.reduce(mostNumberOfLikes, {likes :-1}) // The starting value is 0 so it works corcectly
} 

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
