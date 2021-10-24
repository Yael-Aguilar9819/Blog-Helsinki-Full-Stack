import React, { useState, useEffect } from 'react'
import ListOfBlogs from './components/ListOfBlogs'
import LoginForm from './components/LoginForm'

// Both of this services loosely couple the backend with the frontend
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    // It has to be an inner function
    // Because useEffect functions have to be synchronous
    // To avoid race conditions 
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);  
    }
    fetchBlogs();
  }, [])

// This is the main function that handles the login function
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({
      username, password,
    })
    window.localStorage.setItem(
      'loggedNoteappUser', JSON.stringify(user)
    ) 
    // This receives the token and cleans the usernames
    blogService.setToken(user.token)
    // If the object returned has NOT a property called token
    // A verification error will be shown to the user
    if (!!!user.token) {
      createTemporalErrorMessage("Wrong credentials")
      return; 
    }
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    createTemporalErrorMessage(exception);
  }
}

// This created a temporal error message to be shown to the user
const createTemporalErrorMessage = (message) => {
  setErrorMessage(message)
  setTimeout(() => {
    setErrorMessage(null)
  }, 5000)
}

  return (
    <div>
      {/* This invokes the loginForm  */}

      {user === null ?
      <LoginForm loginFunc = {handleLogin} nameField = {username} 
        setNameFunc = {setUsername} passField = {password} setPassFunc = {setPassword}/> :
      <div>
        <div>
        <p>{user.username} logged-in</p>
        {<h2>TODO a way to create new notes</h2>}
        </div>
        <ListOfBlogs blogs = {blogs}/>
      </div>
      }
    </div>
  )
}

export default App