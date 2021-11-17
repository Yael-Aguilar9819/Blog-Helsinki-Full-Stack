import React from 'react';
import PropTypes from 'prop-types';

// This jus separates the blog simplified view from the rest of the blog data
const BlogDetailedView = ({ blogInfo, visiblityFunc }) => (
  <div />
);


// Every property of the blog we are going to use
BlogDetailedView.propTypes = {
  blogInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
  }).isRequired,

  // This is the function that controls the render
  visiblityFunc: PropTypes.func.isRequired,
};

export default BlogDetailedView;
