// Import the HttpClient class
const HttpClient = require('./http-client');

// Instantiate the HttpClient with the base URL
const client = new HttpClient('https://jsonplaceholder.typicode.com');

// Fetching data from /posts endpoint
client.get('/posts')
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Interceptors example
const client2 = new HttpClient('https://jsonplaceholder.typicode.com');

// Adding a request interceptor
client2.addRequestInterceptor(async (config) => {
    console.log('Request Interceptor:', config);
    // Add a custom header
    config.headers = {
        ...config.headers,
        'X-Custom-Header': 'CustomHeaderValue',
    };
    return config;
});

    // Adding a response interceptor
client2.addResponseInterceptor(async (response) => {
  console.log('Response Interceptor - Status:', response.status);
  // Modify the response data by adding a custom field
  response.data = {
      ...response.data,
      intercepted: true,
  };
  return response;
});

// Example GET request
client2.get('/posts/1')
  .then(response => {
      console.log('Modified Response:', response.data);
  })
  .catch(error => {
      console.error('Error:', error);
  });