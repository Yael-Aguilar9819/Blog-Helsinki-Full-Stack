import React from 'react'
import Blog from './Blog'
const ListOfBlogs = ({blogs}) => (
    blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )
)

export default ListOfBlogs