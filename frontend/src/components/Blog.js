import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BlogSimplifiedView from './BlogSimplifiedView';
import BlogDetailedView from './BlogDetailedView';
import styles from './Blog.module.css';

const Blog = ({ blog, likeFunction, removeBlogFunc }) => {
  const [detailsShown, setDetailsShown] = useState(false);

  // This function inverses what is shown after each press of the button
  const blogVisibility = () => {
    setDetailsShown(!detailsShown);
  };

  // This composes functions that retrieves the blog info to the main app
  const composedLikeFunc = () => {
    likeFunction(blog);
  };

  const composedRemoveFunc = () => {
    // This will execute if the user accepts the windows prompt
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlogFunc(blog);
    }
    // otherwise, it doesnt do anything
  };

  // This function will select what kind of blog to render if
  const RenderAccordingToVisibility = () => {
    if (detailsShown) {
      return (
        <BlogDetailedView
          blogInfo={blog}
          addLikeFunc={composedLikeFunc}
          visiblityFunc={blogVisibility}
          removeBlogFunc={composedRemoveFunc}
        />
      );
    }
    return (
      <BlogSimplifiedView
        title={blog.title}
        author={blog.author}
        visiblityFunc={blogVisibility}
      />
    );
  };

  // ternary
  return (
    <div className={styles.blogSeparator}>
      <RenderAccordingToVisibility />
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
  // Required at the end, so the component needs the blog name

  likeFunction: PropTypes.func.isRequired,
  removeBlogFunc: PropTypes.func.isRequired,
};

export default Blog;
