import httpStatus from 'http-status';
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

// const getAllRooms = catchAsync(async (req, res) => {
//   const result = await RoomServices.getAllRoomsFromDB();
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Room retrieved successfully',

//     data: result,
//   });
// });
const getAllRooms = catchAsync(async (req, res) => {
  // Get query parameters for pagination
  const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit as string, 10) || 9; // Default to 9 rooms per page if not specified

  // Fetch paginated rooms from the service
  const result = await RoomServices.getAllRoomsFromDB(page, limit);

  // Return response with paginated rooms data
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rooms retrieved successfully',
    data: {
      rooms: result.rooms, // List of rooms
      totalRooms: result.totalRooms, // Total rooms count
      totalPages: result.totalPages, // Total pages count
      currentPage: result.currentPage, // Current page number
    },
  });
});
// Controller for getting all rooms with pagination, filters, search, and sorting
// Controller to get all rooms with pagination





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
