import React, { useState, useEffect } from 'react'
import ListOfBlogs from './components/ListOfBlogs'
import LoginForm from './components/LoginForm'

// Both of this services loosely couple the backend with the frontend
import blogService from './services/blogs'
import loginService from './services/login' 

const nameToStoreUserInfo = "loggedBlogUser"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  // This creates a default new object
  const [newBlogInfo, setNewBlogInfo] = useState({title:'', author:'', url:''})
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

  useEffect(() => {
    // It checks whatever the localStorage has that variable
    // The user is the one who is controlled
    const loggedUserJSON = window.localStorage.getItem(nameToStoreUserInfo)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
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
    window.localStorage.setItem(nameToStoreUserInfo, JSON.stringify(user))
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    createTemporalErrorMessage(exception);
  }
}

// This function will handle the form of the new blog
const handleNewBlog = async (event) => {
  event.preventDefault()
  try {
    // console.log("Going to send this new blog: ", newBlogInfo)
    // Thos connects directly to the backend through the handler
    const createdBlog = await blogService.create(newBlogInfo)
    console.log("it passed!")
    // console.log(JSON.stringify(createdBlog))
  } catch (exception) {
    createTemporalErrorMessage(exception);
  }
}

const handlePropertyOfNewBlog = (target, property) => {
  // Not really efficient, but only happens every keystroke
  // Fromt the user
  const newBlog = Object.assign({}, newBlogInfo);
  // Using [] the previous info in the property can be modified
  newBlog[property] = target
  setNewBlogInfo(newBlog)
}

const newBlogForm = () => (
  <form onSubmit ={handleNewBlog}>
      <div>
        Title:
          <input
          type="text"
          value= {newBlogInfo.title}
          name="Title"
          onChange={({ target }) => handlePropertyOfNewBlog(target.value, 'title')}
          />
      </div>
      <div>
      Author:
          <input
          type="text"
          value={newBlogInfo.author}
          name="Author"
          onChange={({ target }) => handlePropertyOfNewBlog(target.value, 'author')}
          />
      </div>
      <div>
      URL:
          <input
          type="text"
          value={newBlogInfo.url}
          name="URL"
          onChange={({ target }) => handlePropertyOfNewBlog(target.value, 'url')}
          />
      </div>
      <button type="submit">Create</button>
    </form>   
)

// This is the function that the logout button calls to
// So everything concerning the user is now deleted
const logOutFunction = () => {
  window.localStorage.removeItem(nameToStoreUserInfo)
  blogService.setToken("null")
  setUser(null)
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
      {user === null ?
      // this passes everything to the LoginForm function
      <LoginForm loginFunc = {handleLogin} nameField = {username} 
        setNameFunc = {setUsername} passField = {password} setPassFunc = {setPassword}/> :
      <div>
        <div>
        <p className="username-permanent">{user.username} logged in</p>
        <button onClick={logOutFunction}>Log out</button>
        {<h2>Create new blog</h2>}
        {newBlogForm()}
        </div>
        <ListOfBlogs blogs = {blogs}/>
      </div>
      }
    </div>
  )
}

export default App