import { useState } from 'react'

const Blog = ({ blog, updateLike, deleteBlog, user }) => {
  const [showBlog, setShowBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setShowBlog(!showBlog)
  }

  const handleLike = async (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const name = blog.user.name
    const id = blog.user.id
    const username = blog.user.username
    updateLike(updatedBlog, name, id, username)
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (

    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{showBlog ? 'hide': 'view'}</button>
      </div>
      {showBlog && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
          {user && user.username === blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )}

export default Blog