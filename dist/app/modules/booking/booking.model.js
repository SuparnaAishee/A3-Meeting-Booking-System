"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.BookingStatus = void 0;
const mongoose_1 = require("mongoose");
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["confirmed"] = "confirmed";
    BookingStatus["unconfirmed"] = "unconfirmed";
    BookingStatus["cancelled"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
const bookingSchema = new mongoose_1.Schema({
    slots: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Slot', required: true }],
    room: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    totalAmount: { type: Number },
    isConfirmed: {
        type: String,
        enum: Object.values(BookingStatus),
        default: BookingStatus.unconfirmed,
    },
    isDeleted: { type: Boolean, default: false },
}, { versionKey: false });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
