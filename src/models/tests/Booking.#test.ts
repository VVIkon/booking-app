import { BookingModel } from '../booking';
import { mockKnex } from '../../test/mocks/database';

describe('BookingModel', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const mockBooking = {
		id: 1,
		event_id: 1,
		user_id: 'user123',
		created_at: new Date(),
	};

	describe('create', () => {
		it('should create a new booking', async () => {
			const bookingData = {
				event_id: 1,
				user_id: 'user123',
			};

			(mockKnex.returning as jest.Mock).mockResolvedValue([mockBooking]);

			const result = await BookingModel.create(bookingData);

			expect(mockKnex.insert).toHaveBeenCalledWith(bookingData);
			expect(mockKnex.returning).toHaveBeenCalledWith('*');
			expect(result).toEqual([mockBooking]);
		});
	});

	describe('findByEventAndUser', () => {
		it('should return booking for event and user', async () => {
			(mockKnex.first as jest.Mock).mockResolvedValue(mockBooking);

			const result = await BookingModel.findByEventAndUser(1, 'user123');

			expect(mockKnex.where).toHaveBeenCalledWith({
				event_id: 1,
				user_id: 'user123',
			});
			expect(result).toEqual(mockBooking);
		});

		it('should return null when booking not found', async () => {
			(mockKnex.first as jest.Mock).mockResolvedValue(null);

			const result = await BookingModel.findByEventAndUser(1, 'nonexistent');

			expect(result).toBeNull();
		});
	});

	describe('getEventBookingsCount', () => {
		it('should return correct bookings count', async () => {
			const mockCount = { count: '25' };
			(mockKnex.first as jest.Mock).mockResolvedValue(mockCount);

			const result = await BookingModel.getEventBookingsCount(1);

			expect(mockKnex.where).toHaveBeenCalledWith({ event_id: 1 });
			expect(mockKnex.count).toHaveBeenCalledWith('* as count');
			expect(result).toBe(25);
		});
	});

	describe('getAll', () => {
		it('should return all bookings with event details', async () => {
			const mockBookings = [
				{
					...mockBooking,
					event_name: 'Test Event',
					total_seats: 100,
				},
			];

			(mockKnex.select as jest.Mock).mockResolvedValue(mockBookings);

			const result = await BookingModel.getAll();

			expect(mockKnex.join).toHaveBeenCalledWith('events', 'bookings.event_id', 'events.id');
			expect(result).toEqual(mockBookings);
		});
	});
});
