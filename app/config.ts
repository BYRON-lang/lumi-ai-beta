// Environment configuration for the frontend
const config = {
  // Default to production API URL if not overridden by environment variables
  API_BASE_URL: 'https://auth-lumi.gridrr.com'
};

// In development, you can override the API URL if needed
if (import.meta.env.DEV) {
  // You can set this in your .env file as VITE_API_BASE_URL
  config.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.API_BASE_URL;
}

export default config;
