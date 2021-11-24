import React from 'react';
import Blog from './Blog';

const ListOfBlogs = ({ blogs, likeFunction }) => (
  blogs.map(blog => <Blog key={blog.id} blog={blog} likeFunction={likeFunction} />)
);

export default ListOfBlogs;
