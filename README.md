# HttpClient

A simple HTTP client library for Node.js and browser environments, with an Axios-like interface. This client supports GET, POST, PUT, DELETE requests and allows adding request and response interceptors for enhanced flexibility and control.

## Features

- Supports Node.js and browser environments
- GET, POST, PUT, DELETE methods
- Base URL configuration
- Request and response interceptors
- Handles JSON request and response bodies

## Installation

Clone this repository and navigate to the project directory:

```bash
git clone <repository-url>
cd <project-directory>
```

Ensure you have Node.js installed.

## Usage
Basic Setup

Import the HttpClient class:

```
const HttpClient = require('./HttpClient');
```

Instantiate the client with a base URL:
```
const client = new HttpClient('https://jsonplaceholder.typicode.com');
```

Example: GET Request
To fetch data from an API endpoint, use the get method:

```
client.get('/posts')
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

```

This will make a GET request to https://jsonplaceholder.typicode.com/posts and log the response.

Example: POST Request
To send data to an API endpoint, use the post method:

```
client.post('/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
})
.then(response => {
    console.log('Post Response:', response.data);
})
.catch(error => {
    console.error('Error:', error);
});
```

This will make a POST request to https://jsonplaceholder.typicode.com/posts with the provided data payload.

## Adding Interceptors
You can add interceptors to modify requests before they are sent or responses before they are returned to your application.

Request Interceptor

```
client.addRequestInterceptor(async (config) => {
    console.log('Request Interceptor:', config);
    config.headers = {
        ...config.headers,
        Authorization: 'Bearer your-token',
    };
    return config;
});
```

Response Interceptor

```
client.addResponseInterceptor(async (response) => {
    console.log('Response Interceptor:', response);
    return response;
});

```

## Example: PUT Request

```
client.put('/posts/1', {
    id: 1,
    title: 'Updated Title',
    body: 'Updated Body',
    userId: 1,
})
.then(response => {
    console.log('PUT Response:', response.data);
})
.catch(error => {
    console.error('Error:', error);
});
```

## Example DELETE Request

```
client.delete('/posts/1')
    .then(response => {
        console.log('DELETE Response:', response.status);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

## Technical Notes
Request and response interceptors are mechanisms that allow you to modify or process requests before they are sent and responses before they are processed by your application. They provide a powerful way to centralize and automate tasks related to HTTP requests and responses, such as adding headers, logging, error handling, and more.

### Purpose of Request Interceptors
Request interceptors allow you to execute custom logic before a request is sent to the server. This can be useful for:

Adding Authentication Tokens:

Automatically attach authentication tokens (like JWT or OAuth tokens) to the headers of every outgoing request.
Example: Adding a Bearer token to the Authorization header.
javascript
```
client.addRequestInterceptor(async (config) => {
    config.headers['Authorization'] = `Bearer ${yourToken}`;
    return config;
});
```

Modifying Request Data:

Transform the request data before sending it to the server. For example, you might want to serialize the data or modify its structure.
Example: Converting a data object to a different format.

```
client.addRequestInterceptor(async (config) => {
    config.data = transformData(config.data);
    return config;
});
```

Centralized Logging:

Log details of each request (like the URL, method, headers, and data) for debugging or analytics purposes.

```client.addRequestInterceptor(async (config) => {
    console.log('Making request to:', config.url);
    return config;
});
```

Handling Conditional Logic:

Implement conditional logic based on certain criteria. For example, you might want to cancel requests if certain conditions are met or redirect the request to a different endpoint.

```
client.addRequestInterceptor(async (config) => {
    if (config.url === '/forbidden') {
        throw new Error('Forbidden request');
    }
    return config;
});
```

### Purpose of Response Interceptors
Response interceptors allow you to execute custom logic after a response is received from the server but before it's processed by your application. This can be useful for:

Centralized Error Handling:

Handle common errors (like 401 Unauthorized or 500 Internal Server Error) in one place, rather than repeating error-handling logic throughout your application.

```
client.addResponseInterceptor(async (response) => {
    if (response.status === 401) {
        // Handle unauthorized access
        redirectToLogin();
    }
    return response;
});
```

Data Transformation:

Modify or format the response data before it reaches your application. For example, you could standardize the structure of response data across different API endpoints.

```
client.addResponseInterceptor(async (response) => {
    response.data = transformResponseData(response.data);
    return response;
});
```

Caching Responses:

Implement caching strategies by storing certain responses in memory or local storage to avoid making repeated network requests.

```
client.addResponseInterceptor(async (response) => {
    cacheResponse(response.url, response.data);
    return response;
});
```

Logging Responses:

Log details of each response (like the status code, headers, and data) for debugging, auditing, or analytics purposes.

```
client.addResponseInterceptor(async (response) => {
    console.log('Received response from:', response.url);
    console.log('Response data:', response.data);
    return response;
});
```

Automatic Retrying:

Automatically retry failed requests based on certain criteria (e.g., network errors or specific status codes like 502 Bad Gateway).

```
client.addResponseInterceptor(async (response) => {
    if (response.status >= 500) {
        // Retry the request
        return client.request(response.config);
    }
    return response;
});
```

## Summary
Interceptors provide a centralized, reusable, and consistent way to manage and manipulate HTTP requests and responses across your application. By using interceptors, you can simplify your codebase by avoiding repetitive tasks, ensuring that certain actions (like adding authentication headers or handling errors) are consistently applied to every request and response. This modular approach can make your HTTP client more maintainable, testable, and flexible.

## Security Considerations
- CSRF Protection: Include CSRF tokens in your requests to prevent CSRF attacks.
- Secure Cookies: Set secure flags on cookies when using this client in a browser environment.
- Input Validation: Ensure all input data is properly validated and sanitized on the server side.

## License
This project is open-source and available under the MIT License.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

