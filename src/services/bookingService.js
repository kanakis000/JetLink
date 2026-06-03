import apiClient from './apiClient';

export const getUserBookings = (userId) => apiClient.get(`/bookings/user/${userId}`);

export const cancelBookingById = (bookingId) => apiClient.delete(`/bookings/cancel/${bookingId}`);

export const getManagerBookings = (managerId) => apiClient.get(`/bookings/manager/${managerId}`);

export const getHotelBookings = (hotelId) => apiClient.get(`/bookings/hotel/${hotelId}`);

export const checkAvailability = (hotelId, checkIn, checkOut) =>
	apiClient.get(`/bookings/availability/${hotelId}`, {
		params: { check_in: checkIn, check_out: checkOut },
	});

export const createBooking = (payload) => apiClient.post(`/bookings`, payload);
