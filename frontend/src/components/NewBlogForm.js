import React, { useState } from 'react';
import PropTypes from 'prop-types';

// login form is the main component of the login functions
const NewBlogForm = ({ createNewBlogServ, messageAsTitle }) => {
  // This creates a default new object
  const [newBlogInfo, setNewBlogInfo] = useState({ title: '', author: '', url: '' });

  const handlePropertyOfNewBlog = (target, property) => {
    // Not really efficient, but only happens every keystroke
    // From the user
    const newBlog = { ...newBlogInfo };
    // Using [] the previous info in the property can be modified
    newBlog[property] = target;
    setNewBlogInfo(newBlog);
  };

  const visuallyAddNote = async event => {
    event.preventDefault();

    const emptyNewBlogInfo = Object.keys(newBlogInfo)
    // This reduce function makes every property an empty String
      .reduce((property, value) => {
        // In this specific case, it's not bad because
        // The object is an inner object
        /* eslint-disable no-param-reassign */
        property[value] = '';
        /* eslint-enable no-param-reassign */
        return property;
      }, {});

    // This offloads everythign outside of this form to the main app
    createNewBlogServ(newBlogInfo);

    setNewBlogInfo(emptyNewBlogInfo);
  };

  return (
    <div>
      <h2>{messageAsTitle}</h2>

      {/* // This is the function that controls how the info inside the form is used */}
      <form onSubmit={visuallyAddNote}>
        {/* to be separated in different components */}
        <div>
          Title:
          <input
            type="text"
            value={newBlogInfo.title}
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
    </div>
  );
};

// This will add a small amount of type safety
NewBlogForm.propTypes = {
  createNewBlogServ: PropTypes.func.isRequired,
  messageAsTitle: PropTypes.string.isRequired,
};

export default NewBlogForm;
