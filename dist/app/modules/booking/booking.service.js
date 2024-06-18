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
    const isDateExists = yield slot_model_1.Slot.exists({ date });
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
    // Checking if the user exists
    const userInfo = yield user_model_1.User.findById(user);
    if (!userInfo) {
        throw new Error('User not found');
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
const getMyBookingsFromDB = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myBooking = yield booking_model_1.Booking.find({ user: userId })
        .populate('room')
        .populate('slots')
        .populate('user')
        .exec();
    return myBooking;
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
    const result = yield booking_model_1.Booking.findByIdAndUpdate(id, { isConfirmed: 'confirmed' }, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteBookingFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
