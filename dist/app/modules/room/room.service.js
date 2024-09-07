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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const room_model_1 = require("./room.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createRoomIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRoom = yield room_model_1.Room.findOne({
        name: payload.name,
        roomNo: payload.roomNo,
        floorNo: payload.floorNo,
    });
    if (existingRoom) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room already exists !');
    }
    const newRoom = yield room_model_1.Room.create(payload);
    return newRoom;
});
const getSingleRoomFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield room_model_1.Room.isRoomExistsByID(id);
    if (!room) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room is not Exists!');
    }
    const isRoomDeleted = room === null || room === void 0 ? void 0 : room.isDeleted;
    if (isRoomDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room is deleted!');
    }
    const result = yield room_model_1.Room.findOne({ _id: id });
    return result;
});
const getAllRoomsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield room_model_1.Room.find().exec();
    return rooms;
});
const updateRoomIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { amenities } = payload, roomRemainingData = __rest(payload, ["amenities"]);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //  Update basic room info excluding amenities
        const updatedBasicRoomInfo = yield room_model_1.Room.findByIdAndUpdate(id, roomRemainingData, {
            new: true,
            runValidators: true,
            session,
        });
        if (!updatedBasicRoomInfo) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update room');
        }
        //  amenities array update
        if (amenities && amenities.length > 0) {
            const currentRoom = yield room_model_1.Room.findById(id).session(session);
            if (!currentRoom) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room not found');
            }
            for (const amenity of amenities) {
                if (currentRoom.amenities.includes(amenity)) {
                    // Remove amenity if it exists
                    yield room_model_1.Room.findByIdAndUpdate(id, {
                        $pull: { amenities: amenity },
                    }, {
                        new: true,
                        runValidators: true,
                        session,
                    });
                }
                else {
                    // Add amenity if it does not exist
                    yield room_model_1.Room.findByIdAndUpdate(id, {
                        $addToSet: { amenities: amenity },
                    }, {
                        new: true,
                        runValidators: true,
                        session,
                    });
                }
            }
        }
        //  Commit the transaction
        yield session.commitTransaction();
        yield session.endSession();
        //  Return the updated room
        const result = yield room_model_1.Room.findById(id).populate('amenities.room');
        return result;
    }
    catch (err) {
        console.error(err);
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update room');
    }
});
const deleteRoomFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isRoomExist = yield room_model_1.Room.findById(id);
    if (!isRoomExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room not found');
    }
    if (!isRoomExist || isRoomExist.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Room is  already Deleted');
    }
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
