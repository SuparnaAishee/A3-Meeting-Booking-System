import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RoomServices } from "./room.service";

const createRoom = catchAsync(async (req, res, next) => {
  const result = await RoomServices.createRoomIntoDB(req.body);
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
})


export const RoomControllers={
    createRoom,getSingleRoom
}
