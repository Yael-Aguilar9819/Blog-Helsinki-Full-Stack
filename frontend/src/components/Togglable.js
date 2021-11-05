import React, { useState } from 'react'

const Togglable = ({buttonLabel}) => {
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
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable