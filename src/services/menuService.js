import apiClient from './apiClient';

export const getMenu = (restaurantId) => apiClient.get(`/menu/${restaurantId}`);

export const addMenu = (formData) =>
	apiClient.post(`/menu/add`, formData);

export const updateMenu = (id, formData) =>
	apiClient.put(`/menu/update/${id}`, formData);

export const deleteMenu = (id) =>
	apiClient.delete(`/menu/delete/${id}`);
