import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BlogSimplifiedView from './BlogSimplifiedView';

const Blog = ({ blog }) => {
  const [detailsShown, setDetailsShown] = useState(false);

  // This function inverses what is shown after each press of the button
  const blogVisibility = () => {
    setDetailsShown(!detailsShown);
    console.log(blog)
  };

  // ternary with a placeholder - for now
  return (
    <div>
      {detailsShown
        ? <b>DetailedBlogInfo Placeholder</b>
        : (
          <BlogSimplifiedView
            title={blog.title}
            author={blog.author}
            visiblityFunc={blogVisibility}
          />
        )}
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
};

export default Blog;
