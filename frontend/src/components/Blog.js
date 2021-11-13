import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => {
  const [detailsShown, setdetailsShown] = useState(false);

  const blogVisibility = () => {
  };

  return (
    <div>
      {blog.title}
      {' '}
      {blog.author}
      <button type="submit" onClick={blogVisibility}>View</button>
    </div>
  );
};

// This is a small type validation because this project is not using typescript
Blog.propTypes = {
  // shape instead of objectOf because the categories are known before
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }).isRequired,
  // Required at the end, so the component need the blog name
};

export default Blog;
