const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const methodToBackendReturnJson = async (url, method, body, token) => {
  const response = await fetch(url, {
                          method: method,
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': token
                          },
                          body: body
                        })
  // now it passes if it's just a satisfactory response
  if (response.status < 200 || response.status > 299) {
    throw new Error(`cannot fetch data with error code: ${response.status}`);
  }
                  
return response.json();
}

const create = newObject => {
  return methodToBackendReturnJson(baseUrl, "POST", JSON.stringify(newObject), token);
}

const update = (id, newObject) => {
  return methodToBackendReturnJson(`${baseUrl}/${id}`, "PUT", JSON.stringify(newObject), token);
}


const getAll = async () => {
  const response = await fetch(baseUrl);
  return response.json()
}

const exportedObject = {
  getAll,
  create, 
  update,
  setToken,
};  

export default exportedObject