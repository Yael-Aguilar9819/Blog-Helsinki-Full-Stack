import React from 'react';
import PropTypes from 'prop-types';

// login form is the main component of the login functions
const LoginForm = ({
  loginFunc, nameField, setNameFunc, passField, setPassFunc,
}) => (
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
);

// This is a small validation because this project is not using typescript
LoginForm.propTypes = {
  loginFunc: PropTypes.func.isRequired,
  nameField: PropTypes.string.isRequired,
  setNameFunc: PropTypes.func.isRequired,
  passField: PropTypes.string.isRequired,
  setPassFunc: PropTypes.func.isRequired,
};

export default LoginForm;
