// Environment configuration for the frontend
const isBrowser = typeof window !== 'undefined';

// Default to production API URL if not overridden
let API_BASE_URL = 'https://auth-lumi.gridrr.com';

// In development, use localhost for local development
if (isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  API_BASE_URL = 'https://auth-lumi.gridrr.com';
}

// Allow overriding via environment variables
const env = typeof process !== 'undefined' ? process.env : (import.meta?.env || {});

if (env.VITE_API_BASE_URL) {
  API_BASE_URL = env.VITE_API_BASE_URL;
}

const config = {
  API_BASE_URL,
  // Add other config values here
} as const;

export default config;
