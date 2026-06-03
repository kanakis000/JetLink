import apiClient from './apiClient';

export const getRoomTypes = (hotelId) =>
  apiClient.get(`/room-types/${hotelId}`);

export const initRoomTypes = (hotelId) =>
  apiClient.post(`/room-types/init/${hotelId}`);

export const setRoomTypes = (hotelId, roomTypes) =>
  apiClient.post('/room-types/set', {
    hotel_id: hotelId,
    roomTypes,
  });
