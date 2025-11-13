// src/api/index.ts
// Re-export all API functions for cleaner imports

export * from './api';

// For convenience, also export the main axios instance
export { axiosInstance as default } from './api';