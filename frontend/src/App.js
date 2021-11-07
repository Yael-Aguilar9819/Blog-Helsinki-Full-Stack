import React, { useState, useEffect } from 'react'
import ListOfBlogs from './components/ListOfBlogs'
import NewBlogForm from './components/NewBlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

// Both of this services loosely couple the backend with the frontend
import blogService from './services/blogs'
import loginService from './services/login' 
import Togglable from './components/Togglable'

const nameToStoreUserInfo = "loggedBlogUser"
const NOTIFICATION = {
  POSITIVE:"positive",
  NEGATIVE:"negative"
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  // TO DELETE
  const [newBlogInfo, setNewBlogInfo] = useState({title:'', author:'', url:''})
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)

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
      createTemporalMessageFor5Secs("Wrong credentials", NOTIFICATION.NEGATIVE)
      return; 
    }

    createTemporalMessageFor5Secs("Succesfully logged!", "positive")
    window.localStorage.setItem(nameToStoreUserInfo, JSON.stringify(user))
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    createTemporalMessageFor5Secs(exception, NOTIFICATION.NEGATIVE);
  }
}

// This function will handle the form of the new blog
const addNewBlogToServer = async (event) => {
  event.preventDefault()
  try {
    // This connects directly to the backend through the handler
    const respFromServ = await blogService.create(newBlogInfo)
    
    // This sets the blog response from server
    // As an extra info, the userID it's not yet populated
    setBlogs(blogs.concat(respFromServ))
    
    const emptyNewBlogInfo = 
      // This reduce function makes every property an empty String
      Object.keys(newBlogInfo).reduce((property, value) => {
        property[value] = ''; 
        return property; 
      }, {})

    createTemporalMessageFor5Secs("A new blog was created!", "positive")
    // And it's just applied to the setFunction
    setNewBlogInfo(emptyNewBlogInfo)
    
  } catch (exception) {
    createTemporalMessageFor5Secs(exception, NOTIFICATION.NEGATIVE);
  }
}


// This is the function that the logout button calls to
// So everything concerning the user is now deleted
const logOutFunction = () => {
  window.localStorage.removeItem(nameToStoreUserInfo)
  blogService.setToken("null")
  createTemporalMessageFor5Secs("Logged out succesfully!", "positive")
  setUser(null)
}

// This creates a temporal error message to be shown to the user
const createTemporalMessageFor5Secs = (message, status) => {
  setNotificationMessage({
    message: message, status: status
  })
  // After 5 secs, the notification should disappear
  setTimeout(() => {
    setNotificationMessage(null)
  }, 5000)

}


  return (
    <div>
      <Notification messageInfo = {notificationMessage}/>
      {user === null ?
      // this passes everything to the LoginForm function
      <LoginForm loginFunc = {handleLogin} nameField = {username} 
        setNameFunc = {setUsername} passField = {password} setPassFunc = {setPassword}/> :
      <div>
        <div>
          <p className="username-permanent">{user.username} logged in</p>
          <button onClick={logOutFunction}>Log out</button>
          <Togglable buttonLabel="Create Blog">
            <NewBlogForm createNewBlogFunc={addNewBlogToServer} 
              messageAsTitle={"Create New Blog"}/>
          </Togglable>
        </div>
        <ListOfBlogs blogs = {blogs}/>
      </div>
      }
    </div>
  )
}

export default App