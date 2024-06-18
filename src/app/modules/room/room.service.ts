import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { TRoom } from './room.interface';
import { Room } from './room.model';
import { Request } from 'express';

const createRoomIntoDB = async (payload: TRoom, req: Request) => {
  
  const existingRoom = await Room.findOne({
    name: payload.name,
    roomNo: payload.roomNo,
    floorNo: payload.floorNo,
   
    
  });

  if (existingRoom ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Room already exists !',
    );
  }

const newRoom = await Room.create(payload);


return newRoom;
};

const getSingleRoomFromDB = async (id: string,payload:TRoom) => {
  const room = await Room.isRoomExistsByID(id);
  if (!room) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is not Exists!');
  }
  const isRoomDeleted = room?.isDeleted;
  console.log(isRoomDeleted)
  if (isRoomDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room is deleted!');
  }
  const result = await Room.findOne({ _id: id });
 
  return result;
};

const getAllRoomsFromDB = async (): Promise<TRoom[]> => {
  const rooms = await Room.find().exec();
  return rooms;
};

const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
  const updatedRoom = await Room.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedRoom) {
    throw new Error('Room not found or deleted');
  }

  return updatedRoom;
};

const deleteRoomFromDB = async (id: string) => {
  const result = await Room.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

export const RoomServices = {
  createRoomIntoDB,
  getSingleRoomFromDB,
  getAllRoomsFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB,
};
