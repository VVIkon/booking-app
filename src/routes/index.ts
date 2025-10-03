import { Router } from 'express';
import bookingRoutes from './bookings';

const router = Router();

router.use('/bookings', bookingRoutes);

export default router;
