import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { TRoom } from './room.interface';
import { Room } from './room.model';
import mongoose from 'mongoose';


const createRoomIntoDB = async (payload: TRoom) => {
  
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

const getSingleRoomFromDB = async (id: string) => {
  const room = await Room.isRoomExistsByID(id);
  if (!room) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Room is not Exists!');
  }
  const isRoomDeleted = room?.isDeleted;
  
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
  const { amenities, ...roomRemainingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //  Update basic room info excluding amenities
    const updatedBasicRoomInfo = await Room.findByIdAndUpdate(
      id,
      roomRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updatedBasicRoomInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update room');
    }

  
    //  amenities array update
    if (amenities && amenities.length > 0) {
      const currentRoom = await Room.findById(id).session(session);

      if (!currentRoom) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Room not found');
      }

      for (const amenity of amenities) {
        if (currentRoom.amenities.includes(amenity)) {
          // Remove amenity if it exists
          await Room.findByIdAndUpdate(
            id,
            {
              $pull: { amenities: amenity },
            },
            {
              new: true,
              runValidators: true,
              session,
            },
          );
        } else {
          // Add amenity if it does not exist
          await Room.findByIdAndUpdate(
            id,
            {
              $addToSet: { amenities: amenity },
            },
            {
              new: true,
              runValidators: true,
              session,
            },
          );
        }
      }
    }

    //  Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    //  Return the updated room
    const result = await Room.findById(id).populate('amenities.room');

    return result;
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update room');
  }
};

const deleteRoomFromDB = async (id: string) => {
   const isRoomExist = await Room.findById(id);

   if (!isRoomExist) {
     throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
   }
   
  const result = await Room.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
   
  if (!result || result.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room is  already Deleted');
  }
  return result;
};

export const RoomServices = {
  createRoomIntoDB,
  getSingleRoomFromDB,
  getAllRoomsFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB,
};
