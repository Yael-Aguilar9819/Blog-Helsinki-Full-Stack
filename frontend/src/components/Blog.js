import React from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => (
  <div>
    {blog.title}
    {' '}
    {blog.author}
  </div>
);

Blog.propTypes = {
  blog: PropTypes.object,
  // blog.title: PropTypes.string,
  // blog.author: PropTypes.string
};

export default Blog;
