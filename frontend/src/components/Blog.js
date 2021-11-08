import React from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => (
  <div>
    {blog.title}
    {' '}
    {blog.author}
  </div>
);

// This is a small validation because this project is not using typescript
Blog.propTypes = {
  // ObjectOf instead of Object so it can be specified by property
  blog: PropTypes.objectOf({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }).isRequired,
  //Required at the end, so the component need the blog name
};

export default Blog;
