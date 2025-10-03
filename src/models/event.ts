import db from '../db/database';
import { Event } from '../types';

export class EventModel {
	static async findById(id: number): Promise<Event | null> {
		return db('events').where({ id }).first();
	}

	static async getAvailableSeats(eventId: number): Promise<number | null> {
		const event = await this.findById(eventId);
		if (!event) return null;

		const busySeats = await db('bookings')
			.where({ event_id: eventId })
			.count('* as busySeats')
			.first() || '0';
		return event.total_seats - parseInt(busySeats as string);
	}

	static async getAll(): Promise<Event[]> {
		return db('events').select('*');
	}
}
