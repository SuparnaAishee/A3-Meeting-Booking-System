import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import { TRoom } from "./room.interface";
import { Room } from "./room.model";
import { Request } from "express";
import { User } from "../user/user.model";
import { Types } from "mongoose";
const createRoomIntoDB = async (payload: TRoom, req: Request) => {
  

 
   
    const newRoom = await Room.create(payload);

   
    const existingRoom = await Room.findOne({
      name: payload.name,
      roomNo: payload.roomNo,
      floorNo: payload.floorNo,
      capacity: payload.capacity,
      pricePerSlot: payload.pricePerSlot,
      amenities: payload.amenities,
      isDeleted: false,
    });

   
    if (existingRoom || (newRoom && newRoom.isDeleted)) {
     
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Room already exists or is deleted!',
      );
    }

  
    return newRoom;
  } ;

const getSingleRoomFromDB=async(id:string)=>{

    const room = await Room.isRoomExistsByID(id);
    if (!room) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Room is not Exists!');
    }
    const result = await Room.findOne({_id:id});
    return result;
};

const getAllRoomsFromDB = async(): Promise<TRoom[]> =>{
 const rooms = await Room.find().exec();
 return rooms;
};


const updateRoomIntoDB=async(id:string,payload:Partial<TRoom>)=>{
  

  const updatedRoom = await Room.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  
  if (!updatedRoom) {
    throw new Error('Room not found or deleted');
  }
  
  return updatedRoom;
};

const deleteRoomFromDB = async(id:string)=>{
  const result = await Room.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
}

export const RoomServices = {
    createRoomIntoDB,getSingleRoomFromDB,getAllRoomsFromDB,
    updateRoomIntoDB,deleteRoomFromDB
}