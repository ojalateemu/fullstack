import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('blogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith('Logged in successfully')
    } catch {
      console.log('Error with login')
      notifyWith('Wrong username or password', true)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('blogUser')
    blogService.setToken(null)
    notifyWith('Logged out successfully')
  }

  const createBlog = async (blogObject) => {
    try {
      const { title, author } = blogObject
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      console.log(returnedBlog)
      returnedBlog.user = {
        id: returnedBlog.user,
        name: user.name,
        username: user.username
      }
      setBlogs(blogs.concat(returnedBlog))
      notifyWith('A new blog "' + title + '" by ' + author + ' was added successfully')
    } catch {
      notifyWith('Error with creating a blog', true)
    }
  }

  const updateBlog = async (blogObject, name, id, username) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, blogObject)
      updatedBlog.user = {
        id: id,
        name: name,
        username: username
      }
      const updatedBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog )
      setBlogs(updatedBlogs)
    } catch (e) {
      notifyWith(`Error with updating a blog: ${e}`, true)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)

      const updatedBlogs = blogs.filter(blog => blog.id !== blogObject.id)

      setBlogs(updatedBlogs)
      notifyWith(`Blog "${blogObject.title}" by ${blogObject.author} was deleted successfully`)
    } catch (e) {
      notifyWith(`Error with deleting a blog: ${e}`, true)
    }
  }

  if (user === null) {
    return (
      <LoginForm
        errorMessage={notification}
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} user={user} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes )
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateLike={updateBlog} user={user} deleteBlog={deleteBlog} />
        )
      }
    </div>
  )
}

export default App