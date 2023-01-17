import { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from  './components/BlogForm'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorState, setError] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(initialblogs =>
        setBlogs(initialblogs)
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError('Error: wrong credentials')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService
      .create(blogObject)
      .then(createdBlog => {
        setBlogs(blogs.concat(createdBlog))
        setError(`A new blog added: ${createdBlog.title} by ${createdBlog.author}`)
        setTimeout(() => {
          setError(null)
        }, 3000)
      })
  }

  const updateBlog = (blogObject) => {
    blogService
      .update(blogObject.id, blogObject)
      .then(newBlog => {
        setBlogs(blogs.map(blog =>
          blog.id === blogObject.id ? newBlog : blog))
      })
  }

  const deleteBlog = (id) => {
    blogService
      .remove(id)
      .then(deletedBlog => {
        setBlogs(blogs.filter(blog =>
          blog.id !== deletedBlog.id))
      })
  }

  return (
    <div>
      <Notification message={errorState} />
      {user === null ?
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        /> :
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in
            <button onClick = {handleLogout} type = "submit">logout</button>
          </p>
          <Togglable buttonLabel = "new blog" ref = {blogFormRef}>
            <BlogForm createBlog={addBlog}/>
          </Togglable>
          <div>
            {blogs.sort((a,b) => (b.likes-a.likes))
              .map(blog =>
                <Blog key={blog.id} blog={blog} updateLikes={updateBlog} deleteBlog = {deleteBlog} user = {user}/>
              )}
          </div>
        </div>
      }
    </div>
  )
}

export default App
