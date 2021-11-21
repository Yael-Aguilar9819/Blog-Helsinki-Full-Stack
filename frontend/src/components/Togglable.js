import React, { useState, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

// Children is received from the default props.children desconstrured
// So is ref, but has to be separated because it's not part of props
const Togglable = React.forwardRef(({ buttonLabel, children }, ref) => {
  const [visible, setVisible] = useState(false);

  // This is the that will be shown depending of the visibility
  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  // Each time the button is pressed, the visible property
  // Will change from false -> true or true -> false
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // This exposes the function to the main App
  // So it can be controlled by the parent
  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="submit" onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {/* The children are the object given to the togglable component under it's tree */}
        {children}
        <button type="button" onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  );
});

// This is a small validation because this project is not using typescript
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Togglable;
