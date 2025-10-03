export interface Event {
	id: number;
	name: string;
	total_seats: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface Booking {
	id: number;
	event_id: number;
	user_id: string;
	created_at: Date;
}

export interface BookingRequest {
	event_id: number;
	user_id: string;
}

export interface BookingResponse {
	message: string;
	booking: Booking;
	available_seats: number;
}

export interface ErrorResponse {
	error: string;
	details?: string;
}

export interface HealthResponse {
	status: string;
	timestamp: string;
	environment: string;
}
