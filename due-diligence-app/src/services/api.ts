import axios from 'axios';
import type { Provider, ProviderFormData, ScreeningResult } from '../types/Provider';

// Configure axios instance
const api = axios.create({
  baseURL: 'https://localhost:7058/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Allow self-signed certificates for development
  timeout: 10000
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

// Provider API methods
export const providerApi = {
  // Get all providers
  getAll: async (): Promise<Provider[]> => {
    const response = await api.get('/providers');
    return response.data;
  },

  // Get provider by ID
  getById: async (id: number): Promise<Provider> => {
    const response = await api.get(`/providers/${id}`);
    return response.data;
  },

  // Create new provider
  create: async (provider: ProviderFormData): Promise<Provider> => {
    const response = await api.post('/providers', provider);
    return response.data;
  },

  // Update provider
  update: async (id: number, provider: ProviderFormData): Promise<Provider> => {
    const response = await api.put(`/providers/${id}`, provider);
    return response.data;
  },

  // Delete provider
  delete: async (id: number): Promise<void> => {
    await api.delete(`/providers/${id}`);
  },

  // Screening - check provider against risk lists
  screening: async (id: number, fuentes: string[]): Promise<ScreeningResult[]> => {
    const fuentesParam = fuentes.join(',');
    const response = await api.get(`/providers/${id}/screening?fuentes=${fuentesParam}`);
    return response.data;
  }
};

export default api;