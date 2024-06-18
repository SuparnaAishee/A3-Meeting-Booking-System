"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRouters = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const booking_controller_1 = require("./booking.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user), booking_controller_1.BookingControllers.createBooking);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.getAllBookings);
router.put('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.updateSingleBooking);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.deleteBooking);
exports.BookingRouters = router;
