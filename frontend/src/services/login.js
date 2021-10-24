const baseUrl = '/api/login'

// This will login directly to the server
// Returns a token, name and username
const login = async credentials => {
    const response = 
    await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify(credentials)
        })
    return await response.json()
}

const exportedFunc = {
    login,
  };  
  
export default exportedFunc