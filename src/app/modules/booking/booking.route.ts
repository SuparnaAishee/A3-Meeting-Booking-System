import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { BookingControllers } from './booking.controller';


const router = express.Router();

router.post('/' ,BookingControllers.createBooking);
router.get('/',auth(USER_ROLE.admin) ,BookingControllers.getAllBookings);

router.put('/:id' ,auth(USER_ROLE.admin),BookingControllers.updateSingleBooking);
router.delete('/:id' ,BookingControllers.deleteBooking);






export const BookingRouters = router;