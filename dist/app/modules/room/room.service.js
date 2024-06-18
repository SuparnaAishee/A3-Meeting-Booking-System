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
exports.RoomServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const room_model_1 = require("./room.model");
const createRoomIntoDB = (payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    const newRoom = yield room_model_1.Room.create(payload);
    const existingRoom = yield room_model_1.Room.findOne({
        name: payload.name,
        roomNo: payload.roomNo,
        floorNo: payload.floorNo,
        capacity: payload.capacity,
        pricePerSlot: payload.pricePerSlot,
        amenities: payload.amenities,
        isDeleted: false,
    });
    if (existingRoom || (newRoom && newRoom.isDeleted)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room already exists or is deleted!');
    }
    return newRoom;
});
const getSingleRoomFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield room_model_1.Room.isRoomExistsByID(id);
    if (!room) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room is not Exists!');
    }
    const result = yield room_model_1.Room.findOne({ _id: id });
    return result;
});
const getAllRoomsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield room_model_1.Room.find().exec();
    return rooms;
});
const updateRoomIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedRoom = yield room_model_1.Room.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedRoom) {
        throw new Error('Room not found or deleted');
    }
    return updatedRoom;
});
const deleteRoomFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield room_model_1.Room.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
    });
    return result;
});
exports.RoomServices = {
    createRoomIntoDB,
    getSingleRoomFromDB,
    getAllRoomsFromDB,
    updateRoomIntoDB,
    deleteRoomFromDB,
};
