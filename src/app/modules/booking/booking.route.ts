import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { BookingControllers } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidationSchema } from './booking.validation';

const router = express.Router();

router.post('/', auth(USER_ROLE.user),validateRequest(bookingValidationSchema) ,BookingControllers.createBooking);
router.get('/', auth(USER_ROLE.admin), BookingControllers.getAllBookings);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  BookingControllers.updateSingleBooking,
);
router.delete('/:id', auth(USER_ROLE.admin), BookingControllers.deleteBooking);

export const BookingRouters = router;
