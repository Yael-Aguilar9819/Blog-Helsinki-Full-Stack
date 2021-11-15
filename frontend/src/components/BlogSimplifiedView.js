import React from 'react';
import PropTypes from 'prop-types';

const BlogSimplifiedView = ({ title, author }) => (
    <div>
      {title}
      {' '}
      {author}
      <button type="submit" onClick={blogVisibility}>View</button>
    </div>
);

export default BlogSimplifiedView;
