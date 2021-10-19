import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

const handleLogin = async (event) => {
  event.preventDefault()
  // try {
  //   const user = await loginService.login({
  //     username, password,
  //   })
  //   window.localStorage.setItem(
  //     'loggedNoteappUser', JSON.stringify(user)
  //   ) 

  //   noteService.setToken(user.token)
  //   setUser(user)
  //   setUsername('')
  //   setPassword('')
  // } catch (exception) {
  //   setErrorMessage('Wrong credentials')
  //   setTimeout(() => {
  //     setErrorMessage(null)
  //   }, 5000)
  // }
}

// login form handles the function of the 
const loginForm = () => (
  <form onSubmit={handleLogin}>
    {/* each of this 2 are an input. To be reworked in a component */}
    <div>
      username
        <input
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      password
        <input
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button type="submit">login</button>
  </form>      
)

  return (
    <div>
      {/* This invokes the loginForm  */}
      {loginForm()}
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App