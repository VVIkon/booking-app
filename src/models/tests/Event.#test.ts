import { EventModel } from '../event';
import { mockKnex } from '../../test/mocks/database';

describe('EventModel', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('findById', () => {
		it('should return event by id', async () => {
			const mockEvent = {
				id: 1,
				name: 'Test Event',
				total_seats: 100,
				created_at: new Date(),
				updated_at: new Date(),
			};

			(mockKnex.first as jest.Mock).mockResolvedValue(mockEvent);

			const result = await EventModel.findById(1);

			// expect(mockKnex.where).toHaveBeenCalledWith({ id: 1 });
			expect(mockKnex.first).toHaveBeenCalled();
			expect(result).toEqual(mockEvent);
		});

		it('should return null when event not found', async () => {
			(mockKnex.first as jest.Mock).mockResolvedValue(null);

			const result = await EventModel.findById(999);

			expect(result).toBeNull();
		});
	});

	describe('getAvailableSeats', () => {
		it('should calculate available seats correctly', async () => {
			const mockEvent = {
				id: 1,
				name: 'Test Event',
				total_seats: 100,
			};

			const mockBookedSeats = { count: '30' };

			// Mock findById
			(mockKnex.first as jest.Mock)
				.mockResolvedValueOnce(mockEvent) // First call for event
				.mockResolvedValueOnce(mockBookedSeats); // Second call for bookings count

			const result = await EventModel.getAvailableSeats(1);

			expect(result).toBe(70);
			expect(mockKnex.where).toHaveBeenCalledWith({ event_id: 1 });
		});

		it('should return null when event not found', async () => {
			(mockKnex.first as jest.Mock).mockResolvedValue(null);

			const result = await EventModel.getAvailableSeats(999);

			expect(result).toBeNull();
		});
	});

	describe('getAll', () => {
		it('should return all events', async () => {
			const mockEvents = [
				{ id: 1, name: 'Концерт рок-группы', total_seats: 100 },
				{ id: 2, name: 'Театральная премьера', total_seats: 50 },
				{ id: 3, name: 'Научная конференция', total_seats: 200 },
			];

			(mockKnex.select as jest.Mock).mockResolvedValue(mockEvents);

			const result = await EventModel.getAll();

			expect(mockKnex.select).toHaveBeenCalledWith('*');
			expect(result).toEqual(mockEvents);
		});
	});
});
