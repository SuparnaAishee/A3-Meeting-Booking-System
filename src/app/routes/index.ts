import { Router } from 'express';

import { AuthRoutes } from '../modules/Auth/auth.route';
import { RoomRoutes } from '../modules/room/room.route';
import { SlotRouters } from '../modules/slots/slot.route';

import { BookingRouters } from '../modules/booking/booking.route';
import auth from '../middlewares/auth';
import { USER_ROLE } from '../modules/user/user.constant';
import { BookingControllers } from '../modules/booking/booking.controller';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/rooms',
    route: RoomRoutes,
  },
  {
    path: '/slots',
    route: SlotRouters,
  },
  {
    path: '/bookings',
    route: BookingRouters,
  },
];
router.get(
  '/my-bookings',
  auth(USER_ROLE.user),
  BookingControllers.getMyBookings,
);

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
