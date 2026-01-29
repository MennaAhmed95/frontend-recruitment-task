/**
 * API Configuration
 * Centralized API base URL and endpoints
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    PROJECTS: '/api/projects',
    GRAPHQL: '/graphql',
    HEALTH: '/health',
  },
};

export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;
