import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { RoomRoutes } from "../modules/room/room.route";
import { SlotRouters } from "../modules/slots/slot.route";
import { Booking } from "../modules/booking/booking.model";
import { BookingRouters } from "../modules/booking/booking.route";

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
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

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;