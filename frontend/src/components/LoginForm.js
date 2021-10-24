import React from 'react'
const LoginForm = ({loginFunction, nameField, setNameFunction, passField, setPassFunction}) => {
    return (
        <form onSubmit={loginFunction}>
        {/* each of this 2 are an input. To be reworked in a component */}
        <div>
          username
            <input
            type="text"
            value={nameField}
            name="Username"
            onChange={({ target }) => setNameFunction(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={passField}
            name="Password"
            onChange={({ target }) => setPassFunction(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>      
    
        )
    };
export default LoginForm
