import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { TRoom } from "./room.interface";
import { Room } from "./room.model";

const createRoomIntoDB = async(payload:TRoom)=>{
const room = await Room.isRoomExistsByID(payload._id);
if(room){
    throw new AppError(httpStatus.BAD_REQUEST,'Room Already Exists!')
}
const newRoom = await Room.create(payload);


return newRoom;

};

const getSingleRoomFromDB=async(id:string)=>{

    const room = await Room.isRoomExistsByID(id);
    if (!room) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Room is not Exists!');
    }
    const result = await Room.findOne({_id:id});
    return result;
};

export const RoomServices = {
    createRoomIntoDB,getSingleRoomFromDB
}