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

