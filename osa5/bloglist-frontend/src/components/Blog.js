import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const views = ['view', 'hide']

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    updateLikes({
      ...blog,
      likes: blog.likes+1,
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style = {blogStyle} className = 'blog'>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>{views[Number(visible)]}</button>
      {visible && (
        <div>
          <p>
            {blog.url}
          </p>
          <p>
            {blog.likes} {' '}
            <button onClick = {handleLike} id = 'likebutton'>like</button>
          </p>
          <p>
            {blog.user.username}
          </p>
          {(blog.user.username === user.username) &&(
            <div>
              <button onClick = {handleDelete} id = 'deletebutton'>remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  )}

export default Blog