import axios from 'axios';

/**
 * API client configuration
 * AI-generated axios client for API communication
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

/**
 * Request interceptor for adding auth tokens or logging
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed in the future
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error codes
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error:', data?.error?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
