const baseUrl = '/api/blogs';

let tokenToAuthorize = null;

const setToken = newToken => {
  tokenToAuthorize = `bearer ${newToken}`;
};

const methodToBackendReturnJson = async (url, method, body, tokenFromUser) => {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: tokenFromUser,
    },
    body,
  });
  // now it passes if it's just a satisfactory response
  if (response.status < 200 || response.status > 299) {
    throw new Error(`cannot fetch data with error code: ${response.status}`);
  }

  return response.json();
};

const create = newObject => methodToBackendReturnJson(baseUrl, 'POST', JSON.stringify(newObject), tokenToAuthorize);

const update = (id, newObject) => methodToBackendReturnJson(`${baseUrl}/${id}`, 'PUT', JSON.stringify(newObject), tokenToAuthorize);

const getAll = async () => {
  const response = await fetch(baseUrl);
  return response.json();
};

const exportedObject = {
  getAll,
  create,
  update,
  setToken,
};

export default exportedObject;
