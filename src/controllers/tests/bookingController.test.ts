import { Request, Response } from 'express';
import { BookingController } from '../bookingController';
import { BookingModel } from '../../models/booking';
import { EventModel } from '../../models/event';

// Mock models
jest.mock('../../models/booking');
jest.mock('../../models/event');

const MockedBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const MockedEventModel = EventModel as jest.Mocked<typeof EventModel>;

describe('BookingController', () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let responseObject: any;

	beforeEach(() => {
		responseObject = {};
		mockRequest = {
			body: {},
			query: {},
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockImplementation((result) => {
				responseObject = result;
				return mockResponse;
			}) as any,
		};

		jest.clearAllMocks();
	});

	describe('reserve', () => {
		it('should successfully reserve a seat', async () => {
			const requestBody = {
				event_id: 1,
				user_id: 'user123',
			};

			mockRequest.body = requestBody;

			const mockEvent = {
				id: 1,
				name: 'Test Event',
				total_seats: 100,
			};

			const mockBooking = {
				id: 1,
				event_id: 1,
				user_id: 'user123',
				created_at: new Date(),
			};

			// Mock implementations
			MockedEventModel.findById.mockResolvedValue(mockEvent);
			MockedBookingModel.findByEventAndUser.mockResolvedValue(null);
			MockedEventModel.getAvailableSeats.mockResolvedValue(50);
			MockedBookingModel.create.mockResolvedValue([mockBooking]);

			await BookingController.reserve(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: 'Место успешно забронировано',
				booking: mockBooking,
				available_seats: 49,
			});
		});

		it('should return 400 for missing required fields', async () => {
			mockRequest.body = {};

			await BookingController.reserve(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				error: 'Поля event_id и user_id обязательны',
			});
		});

		it('should return 404 for non-existent event', async () => {
			mockRequest.body = {
				event_id: 999,
				user_id: 'user123',
			};

			MockedEventModel.findById.mockResolvedValue(null);

			await BookingController.reserve(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				error: 'Мероприятие не найдено',
			});
		});

		it('should return 409 for duplicate booking', async () => {
			mockRequest.body = {
				event_id: 1,
				user_id: 'user123',
			};

			const mockEvent = {
				id: 1,
				name: 'Test Event',
				total_seats: 100,
			};

			const existingBooking = {
				id: 1,
				event_id: 1,
				user_id: 'user123',
				created_at: new Date(),
			};

			MockedEventModel.findById.mockResolvedValue(mockEvent);
			MockedBookingModel.findByEventAndUser.mockResolvedValue(existingBooking);

			await BookingController.reserve(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(409);
			expect(mockResponse.json).toHaveBeenCalledWith({
				error: 'Пользователь уже забронировал место на это мероприятие',
			});
		});

			});

	describe('getBookings', () => {
		it('should return all bookings when no event_id specified', async () => {
			const mockBookings = [
				{
					id: 1,
					event_id: 1,
					user_id: 'user123',
					created_at: new Date(),
					event_name: 'Test Event',
					total_seats: 100,
				},
			];

			MockedBookingModel.getAll.mockResolvedValue(mockBookings);

			await BookingController.getBookings(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.json).toHaveBeenCalledWith({
				bookings: mockBookings,
			});
		});

		it('should return bookings for specific event', async () => {
			mockRequest.query = { event_id: '1' };

			const mockBookings = [
				{
					id: 1,
					event_id: 1,
					user_id: 'user123',
					created_at: new Date(),
					event_name: 'Test Event',
					total_seats: 100,
				},
			];

			MockedBookingModel.getByEventId.mockResolvedValue(mockBookings);

			await BookingController.getBookings(mockRequest as Request, mockResponse as Response);

			expect(MockedBookingModel.getByEventId).toHaveBeenCalledWith(1);
			expect(mockResponse.json).toHaveBeenCalledWith({
				bookings: mockBookings,
			});
		});

		it('should return 400 for invalid event_id', async () => {
			mockRequest.query = { event_id: 'invalid' };

			await BookingController.getBookings(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				error: 'event_id должен быть числом',
			});
		});
	});
});
