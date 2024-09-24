import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { BookingControllers } from './booking.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { bookingValidationSchema } from './booking.validation';

const router = express.Router();

router.post('/', BookingControllers.createBooking);//,validateRequest(bookingValidationSchema) 
router.get('/', BookingControllers.getAllBookings);//auth(USER_ROLE.admin), 

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  BookingControllers.updateSingleBooking,
);
router.delete('/:id', BookingControllers.deleteBooking);// auth(USER_ROLE.admin),

export const BookingRouters = router;
