import apiClient from './apiClient';

export const getRestaurantById = (id) => apiClient.get(`/restaurants-bars/${id}`);

export const getAllRestaurants = () => apiClient.get(`/restaurants-bars/all`);

export const getRestaurantsByManager = (managerId) =>
	apiClient.get(`/restaurants-bars/manager/${managerId}`);

export const addRestaurant = (formData) =>
	apiClient.post(`/restaurants-bars/add`, formData);

export const updateRestaurant = (id, formData) =>
	apiClient.put(`/restaurants-bars/update/${id}`, formData);

export const deleteRestaurant = (id) =>
	apiClient.delete(`/restaurants-bars/delete/${id}`);

export const getRestaurantsByRegion = (region, page, limit) =>
	apiClient.get(`/restaurants-bars/region/${region}?page=${page}&limit=${limit}`);
