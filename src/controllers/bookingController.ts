import { Request, Response } from 'express';
import { BookingModel } from '../models/booking';
import { EventModel } from '../models/event';
import { BookingRequest, BookingResponse, ErrorResponse } from '../types';

export class BookingController {
	static async reserve(
		req: Request<{}, BookingResponse | ErrorResponse, BookingRequest>,
		res: Response<BookingResponse | ErrorResponse>,
	): Promise<void> {
		const { event_id, user_id } = req.body;

		// Валидация
		if (!event_id || !user_id) {
			res.status(400).json({
				error: 'Поля event_id и user_id обязательны',
			});
			return;
		}

		if (typeof event_id !== 'number' || event_id <= 0) {
			res.status(400).json({
				error: 'event_id должен быть положительным числом',
			});
			return;
		}

		if (typeof user_id !== 'string' || user_id.trim().length === 0) {
			res.status(400).json({
				error: 'user_id должен быть непустой строкой',
			});
			return;
		}

		try {
			// Проверяем существование мероприятия
			const event = await EventModel.findById(event_id);
			if (!event) {
				res.status(404).json({
					error: 'Мероприятие не найдено',
				});
				return;
			}

			// Проверяем, не забронировал ли пользователь уже место
			const existingBooking = await BookingModel.findByEventAndUser(
				event_id,
				user_id,
			);
			if (existingBooking) {
				res.status(409).json({
					error: 'Пользователь уже забронировал место на это мероприятие',
				});
				return;
			}

			// Проверяем доступность мест
			const availableSeats = await EventModel.getAvailableSeats(event_id);
			if (availableSeats === null || availableSeats <= 0) {
				res.status(400).json({
					error: 'Нет свободных мест на мероприятие',
				});
				return;
			}

			// Создаем бронирование
			const booking = await BookingModel.create({
				event_id,
				user_id,
			});

			if (!booking[0]) {
				res.status(400).json({
					error: 'Бронирование не выполнено',
				});
				return;
			}

			res.status(201).json({
				message: 'Место успешно забронировано',
				booking: booking[0],
				available_seats: availableSeats - 1,
			});
		} catch (error: any) {
			console.error('Ошибка при бронировании:', error);

			// Обработка ошибки уникальности (на случай race condition)
			if (error.code === '23505') {
				res.status(409).json({
					error: 'Пользователь уже забронировал место на это мероприятие',
				});
				return;
			}

			res.status(500).json({
				error: 'Внутренняя ошибка сервера',
				details:
					process.env.NODE_ENV === 'development'
						? error.message
						: undefined,
			});
		}
	}

	static async getBookings(req: Request, res: Response): Promise<void> {
		const { event_id } = req.query;

		try {
			let bookings;

			if (event_id) {
				const eventId = parseInt(event_id as string);
				if (isNaN(eventId)) {
					res.status(400).json({
						error: 'event_id должен быть числом',
					});
					return;
				}
				bookings = await BookingModel.getByEventId(eventId);
			} else {
				bookings = await BookingModel.getAll();
			}

			res.json({
				bookings,
			});
		} catch (error: any) {
			console.error('Ошибка при получении бронирований:', error);
			res.status(500).json({
				error: 'Внутренняя ошибка сервера',
				details:
					process.env.NODE_ENV === 'development'
						? error.message
						: undefined,
			});
		}
	}
}


