const baseUrl = '/api/login'

const login = async credentials => {
    // const response = await axios.post(baseUrl, credentials)
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

export default { login }