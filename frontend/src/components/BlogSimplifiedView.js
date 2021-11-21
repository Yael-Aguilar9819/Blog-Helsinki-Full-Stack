import React from 'react';
import PropTypes from 'prop-types';
import styles from './BlogSimplifiedView.module.css';

// This jus separates the blog simplified view from the rest of the blog data
const BlogSimplifiedView = ({ title, author, visiblityFunc }) => (
  <div>
    {title}
    {' '}
    {author}
    <button
      type="submit"
      className={styles.buttonWithFunction}
      onClick={visiblityFunc}
    >
      View
    </button>
  </div>
);

// It's pretty simple, but still required
BlogSimplifiedView.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  visiblityFunc: PropTypes.func.isRequired,
};

export default BlogSimplifiedView;
