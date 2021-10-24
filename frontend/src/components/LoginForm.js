import React from 'react'

// login form handles the function of the 

const LoginForm = ({loginFunc, nameField, setNameFunc, passField, setPassFunc}) => {
    return (
        <form onSubmit={loginFunc}>
        {/* each of this 2 are an input. To be reworked in a component */}
        <div>
          username
            <input
            type="text"
            value={nameField}
            name="Username"
            onChange={({ target }) => setNameFunc(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={passField}
            name="Password"
            onChange={({ target }) => setPassFunc(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>      
    
        )
    };
export default LoginForm
