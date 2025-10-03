import { Event, Booking, BookingRequest } from '../types';

export const createMockEvent = (overrides: Partial<Event> = {}): Event => ({
	id: 1,
	name: 'Test Event',
	total_seats: 100,
	created_at: new Date(),
	updated_at: new Date(),
	...overrides,
});

export const createMockBooking = (overrides: Partial<Booking> = {}): Booking => ({
	id: 1,
	event_id: 1,
	user_id: 'user123',
	created_at: new Date(),
	...overrides,
});

export const createMockBookingRequest = (overrides: Partial<BookingRequest> = {}): BookingRequest => ({
	event_id: 1,
	user_id: 'user123',
	...overrides,
});
