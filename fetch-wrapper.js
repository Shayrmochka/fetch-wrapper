const API = `http://localhost:4000`

const fetchData = {
    get: async (path, body) => {
        const convertBody = new URLSearchParams(body).toString();
        const response =  await fetch(`${API}${path}?${convertBody}`)
        await (checkFetch(response)) 
        return response.json()
    },
    post: async (path, body = {}) => {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }

        const response = await fetch(path, options)
        await (checkFetch(response)) 
    },
    delete: async (path, item) => {
      const options = {
        method: 'DELETE'
      }
      const convertItem = new URLSearchParams(item).toString();
      const response = await fetch(`${API}${path}/${convertItem}`, options)
      await (checkFetch(response)) 
      return response.json()
    }
}


function checkFetch(response) {
    try {  
      if (response.status === 401) {
        location.href = API
      }
      if (response.status < 200 || response.status >= 300) {
        return response.text();
      }     
      console.log(response.status)     
    } catch (error){
      if (response) {
          throw new ApiError(`Request failed with status ${ response.status }.`, error, response.status);
        } else {
          throw new ApiError(error.toString(), null, 'REQUEST_FAILED');
        }
    } 
}

class ApiError {
  constructor(message, data, status) {
    let response = null;
    let isObject = false;
    try {
      response = JSON.parse(data);
      isObject = true;
    }
    catch (e) {
      response = data;
    }
    this.response = response;
    this.message = message;
    this.status = status;
    this.toString = function () {
      return `${this.message}\nResponse:\n${isObject ? JSON.stringify(this.response, null, 2) : this.response}`;
    };
  }
}
