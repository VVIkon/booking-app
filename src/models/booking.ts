import db from '../db/database';
import { Booking } from '../types';

export class BookingModel {
	static async create(bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking[]> {
		return db('bookings').insert(bookingData).returning('*');
	}

	static async findByEventAndUser(
		eventId: number,
		userId: string,
	): Promise<Booking | null> {
		return db('bookings')
			.where({ event_id: eventId, user_id: userId })
			.first();
	}

	static async getEventBookingsCount(eventId: number): Promise<number> {
		const eventCnt = await db('bookings')
			.where({ event_id: eventId })
			.count('* as eventCnt')
			.first() || '0';

		return parseInt(eventCnt as string);
	}

	static async getAll(): Promise<Booking[]> {
		return db('bookings')
			.join('events', 'bookings.event_id', 'events.id')
			.select(
				'bookings.*',
				'events.name as event_name',
				'events.total_seats',
			);
	}

	static async getByEventId(eventId: number): Promise<Booking[]> {
		return db('bookings')
			.where({ event_id: eventId })
			.join('events', 'bookings.event_id', 'events.id')
			.select(
				'bookings.*',
				'events.name as event_name',
				'events.total_seats',
			);
	}
}
