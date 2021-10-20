const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const response = await fetch(baseUrl);
  return response.json()
}

const exportedObject = {
  getAll,
};  

export default exportedObject