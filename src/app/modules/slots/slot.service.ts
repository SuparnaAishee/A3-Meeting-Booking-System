
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import { generateSlots } from './slot.constant';
import { Room } from '../room/room.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';




// Create slot function
// const createSlotIntoDB = async (payload:TSlot) => {
//   const { room, date, startTime, endTime, isBooked = false } = payload;

//   // Ensure room exists and is not deleted
//   const isRoomExists = await Room.findById(room);
//   if (!isRoomExists) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Room not found!');
//   }

//   const isRoomDeleted = isRoomExists?.isDeleted;
//   if (isRoomDeleted) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Room is deleted!');
//   }

//   // Check if slots already exist for the given room, date, and time range
//   const existingSlots = await Slot.find({
//     room,
//     date,
//     startTime: { $gte: startTime },
//     endTime: { $lte: endTime },
//   });

//   if (existingSlots.length > 0) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Slots already exist in this room for the given time range!'
//     );
//   }

//   const slotDuration = 60;
//   const slots = generateSlots(startTime, endTime, slotDuration); // Assume this is defined

//   // Map slots to save in the database
//   const slotsDetails = slots.map((slot) => ({
//     room,
//     date: date, // Ensure date is in YYYY-MM-DD format
//     startTime: slot.startTime,
//     endTime: slot.endTime,
//     isBooked,
//   }));

//   const createdSlots = await Slot.insertMany(slotsDetails);

//   return createdSlots;
// };
export const getRoomIdByName = async (
  roomName: string,
): Promise<Types.ObjectId> => {
  const room = await Room.findOne({ name: roomName });
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found!');
  }
  return room._id; // Return the ObjectId of the found room
};
const createSlotIntoDB = async (payload: TSlot) => {
  const { room, date, startTime, endTime, isBooked = false } = payload;

  let roomId: Types.ObjectId;

  // Check if room is an ObjectId or a room name
  if (Types.ObjectId.isValid(room)) {
    roomId = new Types.ObjectId(room); // Cast to ObjectId
  } else {
    roomId = await getRoomIdByName(room as unknown as string); // Ensure room is treated as string when calling
  }

  // Ensure room exists and is not deleted
  const isRoomExists = await Room.findById(roomId);
  if (!isRoomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found!');
  }

  const isRoomDeleted = isRoomExists?.isDeleted;
  if (isRoomDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room is deleted!');
  }

  // Check if slots already exist for the given room, date, and time range
  const existingSlots = await Slot.find({
    room: roomId,
    date,
    startTime: { $gte: startTime },
    endTime: { $lte: endTime },
  });

  if (existingSlots.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Slots already exist in this room for the given time range!',
    );
  }

  const slotDuration = 60;
  const slots = generateSlots(startTime, endTime, slotDuration); // Assume this is defined

  // Map slots to save in the database
  const slotsDetails = slots.map((slot) => ({
    room: roomId,
    date: date, // Ensure date is in YYYY-MM-DD format
    startTime: slot.startTime,
    endTime: slot.endTime,
    isBooked,
  }));

  const createdSlots = await Slot.insertMany(slotsDetails);

  return createdSlots;
};
const getAllSlotFromDB = async () => {
  const result = Slot.find().populate('room');
  return result;
};
export const getAvailableSlotFromDB = async (
  query: Record<string, unknown>,
) => {
  const { roomId, date } = query;
  const queryObject: Record<string, unknown> = { isBooked: false }; // Only fetching available slots

  // Validate roomId, but only add to the queryObject if roomId is provided
  if (roomId) {
    if (typeof roomId === 'string' && mongoose.Types.ObjectId.isValid(roomId)) {
      queryObject.room = new mongoose.Types.ObjectId(roomId);
    } else {
      throw new Error('Invalid roomId format');
    }
  }

  // Validate date, but only add to the queryObject if date is provided
  if (date) {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      // Check if the date string is in valid format YYYY-MM-DD
      queryObject.date = date; // Directly use the date string
    } else {
      throw new Error('Invalid date format');
    }
  }

  // Execute the query based on the constructed queryObject
  const result = await Slot.find(queryObject).populate('room');
  return result;
};
// const updateSingleSlotFromDB = async (id: string, payload: TSlot) => {
//   console.log('Service - Slot ID:', id); // Log the ID

//   const isSlotExist = await Slot.findById(id);

//   if (!isSlotExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
//   }

//   if (isSlotExist?.isBooked === true) {
//     throw new AppError(httpStatus.CONFLICT, 'Slot already booked');
//   }

//   const isRoomExists = await Room.findById(payload?.room);

//   if (!isRoomExists) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
//   }

//   const result = await Slot.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };
const updateSingleSlotFromDB = async (id: string, payload: TSlot) => {
  console.log('Service - Slot ID:', id); // Log the ID

  // Validate the format of the ID (if necessary, e.g., MongoDB ObjectId)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Slot ID format');
  }

  // Check if the slot exists
  const isSlotExist = await Slot.findById(id);
  if (!isSlotExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
  }

  // Check if the slot is already booked
  if (isSlotExist.isBooked) {
    throw new AppError(httpStatus.CONFLICT, 'Slot already booked');
  }

  // Validate the room ID from payload
  const isRoomExists = await Room.findById(payload.room);
  if (!isRoomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Update the slot
  const result = await Slot.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  // Handle the case where the update fails
  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update slot',
    );
  }

  return result;
};


const deleteSingleSlotFromDB = async (id: string) => {
  //  slot exists
  const isSlotExist = await Slot.findById(id);

  if (!isSlotExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
  }

  // slot is already booked
  if (isSlotExist?.isBooked) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Slot already booked, can't delete",
    );
  }

  const result = await Slot.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete slot',
    );
  }

  return result;
};

const getSingleSlotFromDB = async (id: string) => {
  const result = await Slot.findById(id);
  return result;
};



export const SlotServices = {
  createSlotIntoDB,
  getAvailableSlotFromDB,
  getAllSlotFromDB,
  updateSingleSlotFromDB,
  deleteSingleSlotFromDB,
  getSingleSlotFromDB,
};
