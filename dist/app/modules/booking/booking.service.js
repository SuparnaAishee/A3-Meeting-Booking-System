"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const slot_model_1 = require("../slots/slot.model");
const booking_model_1 = require("./booking.model");
const room_model_1 = require("../room/room.model");
const user_model_1 = require("../user/user.model");
const createBookingFromSlot = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, slots, user, date } = payload;
    // Checking date exists in any slot
    const isDateExists = yield slot_model_1.Slot.exists({ date, room });
    if (!isDateExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No slots found for the given date');
    }
    // Validate each slot
    for (const slotId of slots) {
        const slot = yield slot_model_1.Slot.findById(slotId);
        if (!slot || slot.isDeleted || slot.isBooked) {
            throw new Error(`Slot ${slotId} is not available`);
        }
    }
    // Checking  room exists and  not deleted
    const roomInfo = yield room_model_1.Room.findById(room);
    if (!roomInfo || roomInfo.isDeleted) {
        throw new Error('Room not found or is deleted');
    }
    // Checking if the room is already booked for the given date
    const isRoomAlreadyBooked = yield slot_model_1.Slot.findOne({
        room: room,
        date: date,
        slots: slots,
        isBooked: true,
    });
    if (isRoomAlreadyBooked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room is already booked for the given date');
    }
    // Checking if the user exists
    const userInfo = yield user_model_1.User.findById(user);
    if (!userInfo) {
        throw new Error('User  not found');
    }
    //  slot array can not empty
    if (!slots || slots.length === 0) {
        throw new Error('Slots array cannot be empty');
    }
    // Calculate total amount
    const perSlotPrice = roomInfo.pricePerSlot;
    const totalAmount = slots.length * perSlotPrice;
    // Create booking
    const createdBooking = yield booking_model_1.Booking.create({
        date,
        slots,
        room,
        user,
        totalAmount,
        isConfirmed: 'unconfirmed',
    });
    const booking = yield booking_model_1.Booking.findById(createdBooking._id)
        .populate('room')
        .populate('slots')
        .populate('user');
    return booking;
});
const getAllBookingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const allBooking = yield booking_model_1.Booking.find()
        .populate('room')
        .populate('slots')
        .populate('user');
    return allBooking;
});
const getMyBookingsFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!payload || typeof payload !== 'object' || !payload.userEmail) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid token payload');
        }
        const userExist = yield user_model_1.User.findOne({ email: payload.userEmail });
        if (!userExist) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No Bookings Found for this user ');
        }
        const bookings = yield booking_model_1.Booking.find({ user: userExist._id })
            .populate('room')
            .populate({
            path: 'slots',
            select: '-__v', // You can exclude other fields as needed
        })
            .select('-user -__v')
            .exec();
        if (!bookings || bookings.length === 0) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No bookings found for this user');
        }
        return bookings;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An error occurred while fetching bookings');
    }
});
const updateSingleBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield booking_model_1.Booking.findById(id);
    if (!isBookingExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    //checking isDeleted or not
    const isDeletedBooking = isBookingExist === null || isBookingExist === void 0 ? void 0 : isBookingExist.isDeleted;
    if (isDeletedBooking) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Booking is already deleted');
    }
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, { isConfirmed: booking_model_1.BookingStatus.confirmed }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    // Update slots to set isBooked to true
    if (result.isConfirmed === booking_model_1.BookingStatus.confirmed) {
        yield Promise.all(result.slots.map((slotId) => __awaiter(void 0, void 0, void 0, function* () {
            // Use ObjectId here
            yield slot_model_1.Slot.findByIdAndUpdate(slotId, { isBooked: true }, { new: true });
        })));
    }
    return result;
});
const deleteBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBookingExist = yield booking_model_1.Booking.findById(id);
    if (!isBookingExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booking not found');
    }
    if (isBookingExist.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Booking is already deleted');
    }
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.BookingServices = {
    createBookingFromSlot,
    getAllBookingsFromDB,
    getMyBookingsFromDB,
    updateSingleBookingFromDB,
    deleteBookingFromDB,
};
