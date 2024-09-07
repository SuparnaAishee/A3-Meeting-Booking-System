import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { TRoom } from './room.interface';
import { Room } from './room.model';
import mongoose from 'mongoose';

interface PaginatedRooms {
  rooms: TRoom[];
  totalRooms: number;
  totalPages: number;
  currentPage: number;
}

// export interface QueryParams {
//   search?: string;
//   page?:number;
//   limit?: number;
//   sort?: string;
// }
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

// 
const getAllRoomsFromDB = async (
  page: number,
  limit: number,
): Promise<PaginatedRooms> => {
  const skip = (page - 1) * limit; // Calculate how many documents to skip

  // Fetch the rooms with pagination
  const rooms = await Room.find().skip(skip).limit(limit).exec();

  // Get the total count of rooms
  const totalRooms = await Room.countDocuments();

  const totalPages = Math.ceil(totalRooms / limit); // Calculate total number of pages

  return {
    rooms, // Paginated list of rooms
    totalRooms, // Total count of rooms
    totalPages, // Total number of pages
    currentPage: page, // Current page number
  };
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
    
  if (!isRoomExist || isRoomExist.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room is  already Deleted');
  }
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
