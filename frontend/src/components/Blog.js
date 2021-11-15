import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => {
  const [detailsShown, setDetailsShown] = useState(false);

  const hideDetails = { display: detailsShown ? 'none' : '' };
  const showDetails = { display: detailsShown ? '' : 'none' };

  // This function inverses what is shown after each press of the button
  const blogVisibility = () => {
    setDetailsShown(!detailsShown);
  };

  const BlogHiddenDetails = ({title, author}) =>{
    return (
      <div>
        {title}
        {' '}
        {author}
        <button type="submit" onClick={blogVisibility}>View</button>
      </div>
      );
  }

  return (
    <div>
      <div>
        {/* {blog.title}
        {' '}
        {blog.author} */}
        <BlogHiddenDetails title={blog.title} author ={blog.author}/>
        {/* <button type="submit" onClick={blogVisibility}>View</button> */}
      </div>
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
