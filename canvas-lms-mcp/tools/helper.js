const callCanvasApi = async (client, method, url, queryParams = {}, bodyParams = {}) => {
  const config = {
    method: method.toLowerCase(),
    url: url
  };

  if (Object.keys(queryParams).length > 0) {
    config.params = queryParams;
  }
  
  if (Object.keys(bodyParams).length > 0) {
    config.data = bodyParams;
  }

  const response = await client(config);
  return response.data;
};

module.exports = {
  callCanvasApi
};
