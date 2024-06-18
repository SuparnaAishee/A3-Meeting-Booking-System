import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoomServices } from './room.service';

const createRoom = catchAsync(async (req, res) => {
  const result = await RoomServices.createRoomIntoDB(req.body);
  const orderedResult = {
    _id:result._id,
name:result.name,
roomNo:result.roomNo,
floorNo:result.floorNo,
capacity:result.capacity,
pricePerSlot:result.pricePerSlot,
amenities:result.amenities,
isDeleted:result.isDeleted
  }
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Room added successfully',

    data:orderedResult,
  });
});

const getSingleRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomServices.getSingleRoomFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Room retrieved successfully',

    data: result,
  });
});

const getAllRooms = catchAsync(async (req, res) => {
  const result = await RoomServices.getAllRoomsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Room retrieved successfully',

    data: result,
  });
});

const updateRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomServices.updateRoomIntoDB(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Room updated successfully',
    data: result,
  });
});

const deleteRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomServices.deleteRoomFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Room Deleted successfully',
    data: result,
  });
});

export const RoomControllers = {
  createRoom,
  getSingleRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
