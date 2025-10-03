import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';

const router = Router();

// Бронирование места
router.post('/reserve', BookingController.reserve);

// Получение списка бронирований
router.get('/', BookingController.getBookings);

export default router;
