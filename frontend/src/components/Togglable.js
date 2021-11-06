import React, { useState } from 'react'

// Children is received from the default props.children desconstrured
const Togglable = ({buttonLabel, children}) => {
  const [visible, setVisible] = useState(false)

  // This is the that will be shown depending of the visibility
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  // Each time the button is pressed, the visible property
  // Will change from false -> true or true -> false
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {/* The children are the object given to the togglable component under it's tree */}
        {children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
}

export default Togglable