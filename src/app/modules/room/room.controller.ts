import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RoomServices } from "./room.service";

const createRoom = catchAsync(async (req, res, next) => {
  const result = await RoomServices.createRoomIntoDB(req.body,req);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Room added successfully',

    data: result,
  });
});

const getSingleRoom = catchAsync(async(req,res,next)=>{
    const {id}=req.params;
   const result = await RoomServices.getSingleRoomFromDB(id);
   sendResponse(res, {
     success: true,
     statusCode: 200,
     message: 'Room retrieved successfully',

     data: result,
   });
});

const getAllRooms = catchAsync(async(req,res)=>{
    const result = await RoomServices.getAllRoomsFromDB();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Room retrieved successfully',

      data: result,
    });
});

const updateRoom = catchAsync(async(req,res)=>{
    const {id}=req.params;
    const result = await RoomServices.updateRoomIntoDB(id,req.body);
     sendResponse(res, {
       success: true,
       statusCode: 200,
       message: 'Room updated successfully',
       data: result,
     });

})


export const RoomControllers={
    createRoom,getSingleRoom,getAllRooms,updateRoom
}
