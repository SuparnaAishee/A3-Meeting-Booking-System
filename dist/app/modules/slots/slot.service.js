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
exports.SlotServices = void 0;
const slot_model_1 = require("./slot.model");
const slot_constant_1 = require("./slot.constant");
const room_model_1 = require("../room/room.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, date, startTime, endTime, isBooked = false } = payload;
    const isroomExists = yield room_model_1.Room.findById(room);
    if (!isroomExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found !');
    }
    const isRoomDeleted = isroomExists === null || isroomExists === void 0 ? void 0 : isroomExists.isDeleted;
    if (isRoomDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room is deleted!');
    }
    // Check  slots already exist for the given room, date, and time range
    const existingSlots = yield slot_model_1.Slot.find({
        room,
        date,
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
    });
    if (existingSlots.length > 0) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Slots already exist in this room for the given  time range!');
    }
    const slotDuration = 60;
    const slots = (0, slot_constant_1.generateSlots)(startTime, endTime, slotDuration);
    // Maping slots
    const slotsDetails = slots.map((slot) => ({
        room,
        date: date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked,
    }));
    const createdSlots = yield slot_model_1.Slot.insertMany(slotsDetails);
    return createdSlots;
});
const getAvaiableSlotFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, date } = query;
    const queryObject = {};
    if (roomId) {
        queryObject.room = roomId;
    }
    if (date) {
        queryObject.date = date;
    }
    const availableSlots = yield slot_model_1.Slot.find(queryObject)
        .populate({ path: 'room', model: 'Room' })
        .exec();
    // Filter out slots that are booked
    const filteredSlots = availableSlots.filter((slot) => !slot.isBooked);
    return filteredSlots;
});
exports.SlotServices = {
    createSlotIntoDB,
    getAvaiableSlotFromDB,
};
