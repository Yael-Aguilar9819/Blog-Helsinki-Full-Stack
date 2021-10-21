import React from 'react'
const ListOfBlogs = ({blogs}) => (
    blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )
)

export default ListOfBlogs