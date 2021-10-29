import React from 'react'

// login form is the main component of the login functions
const NewBlogForm = ({createNewBlogFunc, handleProperties, mainObject}) => {
    return (
      // This is the function that controls how the info inside the form is used
    <form onSubmit ={createNewBlogFunc}>
      {/* to be separated in different components */}
      <div>
        Title:
          <input
          type="text"
          value= {mainObject.title}
          name="Title"
          onChange={({ target }) => handleProperties(target.value, 'title')}
          />
      </div>
      <div>
      Author:
          <input
          type="text"
          value={mainObject.author}
          name="Author"
          onChange={({ target }) => handleProperties(target.value, 'author')}
          />
      </div>
      <div>
      URL:
          <input
          type="text"
          value={mainObject.url}
          name="URL"
          onChange={({ target }) => handleProperties(target.value, 'url')}
          />
      </div>
      <button type="submit">Create</button>
    </form>   
      )
    };
export default NewBlogForm
