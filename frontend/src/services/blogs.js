const baseUrl = '/api/blogs'

const getAll = async () => {
  const request = await fetch(baseUrl);
  return request.then(response => response.data)
}

const exportedObject = {
  getAll,
};

export default exportedObject