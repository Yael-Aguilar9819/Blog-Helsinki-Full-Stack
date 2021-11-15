import React from 'react';
import PropTypes from 'prop-types';

const BlogSimplifiedView = ({ title, author, visiblityFunction }) => (
  <div>
    {title}
    {' '}
    {author}
    <button type="submit" onClick={visiblityFunction}>View</button>
  </div>
);

// It's pretty simple, but still required
BlogSimplifiedView.propTypes = {
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    visiblityFunction: PropTypes.func.isRequired
};
  
export default BlogSimplifiedView;
