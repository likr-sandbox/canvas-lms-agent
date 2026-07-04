const callCanvasApi = async (client, method, url, queryParams = {}, bodyParams = {}, fetchAllPages = false) => {
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

  if (fetchAllPages && config.method === 'get') {
    let allData = [];
    let currentConfig = { ...config };

    while (true) {
      const response = await client(currentConfig);
      if (Array.isArray(response.data)) {
        allData = allData.concat(response.data);
      } else {
        // Not an array, pagination doesn't apply
        return response.data;
      }

      const linkHeader = response.headers && (response.headers.link || response.headers.Link);
      if (!linkHeader) break;

      const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (nextMatch && nextMatch[1]) {
        currentConfig = {
          method: 'get',
          url: nextMatch[1]
        };
      } else {
        break;
      }
    }
    return allData;
  }

  const response = await client(config);
  return response.data;
};

module.exports = {
  callCanvasApi
};
