const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await fetch(baseUrl);
  return response.json()
}

const exportedObject = {
  getAll,
};  

export default exportedObject