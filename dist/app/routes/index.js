"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const room_route_1 = require("../modules/room/room.route");
const slot_route_1 = require("../modules/slots/slot.route");
const booking_route_1 = require("../modules/booking/booking.route");
const auth_1 = __importDefault(require("../middlewares/auth"));
const user_constant_1 = require("../modules/user/user.constant");
const booking_controller_1 = require("../modules/booking/booking.controller");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/rooms',
        route: room_route_1.RoomRoutes,
    },
    {
        path: '/slots',
        route: slot_route_1.SlotRouters,
    },
    {
        path: '/bookings',
        route: booking_route_1.BookingRouters,
    },
];
router.get('/my-bookings', (0, auth_1.default)(user_constant_1.USER_ROLE.user), booking_controller_1.BookingControllers.getMyBookings);
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
