const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

class HttpClient {
  constructor(baseURL = '', csrfToken = '') {
    this.baseURL = baseURL;
    this.csrfToken = csrfToken;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  setCsrfToken(token) {
      this.csrfToken = token;
  }

  async request(method, endpoint, options = {}) {
      let finalOptions = { method, endpoint, ...options };

      // Include CSRF token if available
      if (this.csrfToken) {
          finalOptions.headers = {
              ...finalOptions.headers,
              'X-CSRF-Token': this.csrfToken, // Custom header for CSRF token
          };
      }

      // Run request interceptors
      for (const interceptor of this.requestInterceptors) {
          finalOptions = await interceptor(finalOptions) || finalOptions;
      }

      const url = `${this.baseURL}${finalOptions.endpoint}`;
      let response;

      if (isNode) {
          response = await this.nodeRequest(method, url, finalOptions);
      } else {
          response = await this.browserRequest(method, url, finalOptions);
      }

      // Run response interceptors
      for (const interceptor of this.responseInterceptors) {
          response = await interceptor(response) || response;
      }

      return response;
  }

  // Node.js request
  nodeRequest(method, url, options) {
      return new Promise((resolve, reject) => {
          const parsedURL = require('url').parse(url);
          const isHttps = parsedURL.protocol === 'https:';
          const requestOptions = {
              method,
              hostname: parsedURL.hostname,
              port: parsedURL.port,
              path: parsedURL.path,
              headers: options.headers || {},
          };

          const req = (isHttps ? require('https') : require('http')).request(requestOptions, (res) => {
              let data = '';

              res.on('data', (chunk) => {
                  data += chunk;
              });

              res.on('end', () => {
                  try {
                      const result = JSON.parse(data);
                      resolve({
                          data: result,
                          status: res.statusCode,
                          headers: res.headers,
                      });
                  } catch (err) {
                      resolve({
                          data,
                          status: res.statusCode,
                          headers: res.headers,
                      });
                  }
              });
          });

          req.on('error', (err) => {
              reject(err);
          });

          if (options.data) {
              req.write(JSON.stringify(options.data));
          }

          req.end();
      });
  }

  // Browser request using fetch
  async browserRequest(method, url, options) {
      const fetchOptions = {
          method,
          headers: options.headers || {},
          body: options.data ? JSON.stringify(options.data) : undefined,
      };

      const response = await fetch(url, fetchOptions);
      const data = await response.json();
      return {
          data,
          status: response.status,
          headers: this.headersToObject(response.headers),
      };
  }

  headersToObject(headers) {
      const headersObj = {};
      headers.forEach((value, key) => {
          headersObj[key] = value;
      });
      return headersObj;
  }

  get(endpoint, options = {}) {
      return this.request('GET', endpoint, options);
  }

  post(endpoint, data, options = {}) {
      return this.request('POST', endpoint, { ...options, data });
  }

  put(endpoint, data, options = {}) {
      return this.request('PUT', endpoint, { ...options, data });
  }

  delete(endpoint, options = {}) {
      return this.request('DELETE', endpoint, options);
  }
}

module.exports = HttpClient;
