import apiClient from './apiClient';

export const getHotelById = (id) => apiClient.get(`/hotels/${id}`);

export const getHotelsByRegion = (region, page, limit) => 
  apiClient.get(`/hotels/${region.toLowerCase()}?page=${page}&limit=${limit}`);

export const getAllHotels = () => apiClient.get(`/hotels/all`);

export const getHotelsByManager = (managerId) => apiClient.get(`/hotels/manager/${managerId}`);

export const addHotel = (formData) =>
  apiClient.post('/hotels/add', formData);

export const updateHotel = (id, formData) =>
  apiClient.put(`/hotels/update/${id}`, formData);

export const deleteHotel = (id) =>
  apiClient.delete(`/hotels/delete/${id}`);

export const getRoomTypes = (hotelId) =>
  apiClient.get(`/room-types/${hotelId}`);
