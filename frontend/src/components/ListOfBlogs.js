import React from 'react';
import Blog from './Blog';

const ListOfBlogs = ({ blogs, likeFunction, removeBlogFunction }) => (
  blogs.map(blog => (
    <Blog
      key={blog.id}
      blog={blog}
      likeFunction={likeFunction}
      removeBlogFunc={removeBlogFunction}
    />
  ))
);

export default ListOfBlogs;
