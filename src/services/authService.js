import apiClient from './apiClient';

export const login = (formData) => apiClient.post('/auth/login', formData);

export const register = (payload) => apiClient.post('/auth/register', payload);
