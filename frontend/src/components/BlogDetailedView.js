import React from 'react';
import PropTypes from 'prop-types';


const formatUserIDInBlogs = userID => JSON.stringify(userID).slice(1, -1);

// This just separates the blog simplified view from the rest of the blog data
const BlogDetailedView = ({ blogInfo, visiblityFunc }) => (
  <div>
    {blogInfo.title}
    {' '}
    {blogInfo.author}
    <button type="submit" onClick={visiblityFunc}>Hide</button>
    <br></br>
    {blogInfo.url}
    <br></br>
    Likes {blogInfo.likes}
    <br></br>
    {blogInfo.user.name}
  </div>
);


// Every property of the blog we are going to use
BlogDetailedView.propTypes = {
  blogInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    // All of the properties of user are made of strings
    user: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,

  // This is the function that controls the render
  visiblityFunc: PropTypes.func.isRequired,
};

export default BlogDetailedView;
