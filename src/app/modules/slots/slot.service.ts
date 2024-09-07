
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import { generateSlots } from './slot.constant';
import { Room } from '../room/room.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';








const createSlotIntoDB = async (payload: TSlot) => {
  const { room, date, startTime, endTime, isBooked = false } = payload;

  const isroomExists = await Room.findById(room);

  if (!isroomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found !');
  }

  const isRoomDeleted = isroomExists?.isDeleted;
  if (isRoomDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room is deleted!');
  }
  // Check  slots already exist for the given room, date, and time range
  const existingSlots = await Slot.find({
    room,
    date,
    startTime: { $gte: startTime },
    endTime: { $lte: endTime },
  });

  if (existingSlots.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Slots already exist in this room for the given  time range!',
    );
  }

  const slotDuration = 60;
  const slots = generateSlots(startTime, endTime, slotDuration);

  // Maping slots
  const slotsDetails = slots.map((slot) => ({
    room,
    date: date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isBooked,
  }));

  const createdSlots = await Slot.insertMany(slotsDetails);

  return createdSlots;
};

const getAllSlotFromDB = async () => {
  const result = Slot.find();
  return result;
};

const getAvaiableSlotFromDB = async (query: Record<string, unknown>) => {
  const { roomId, date } = query 
const queryObject: Record<string, unknown> = {};
if (roomId) {
  queryObject.room = roomId;
}
if (date) {
  queryObject.date = date;
}
  
 const availableSlots = await Slot.find(queryObject)
   .populate({ path: 'room', model: 'Room' })
   .exec();

  
  // Filter out slots that are booked

  const filteredSlots = availableSlots.filter((slot) => !slot.isBooked);
  
  return filteredSlots;

};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateSingleSlotFromDB = async (id: string, payload: any) => {
  // Check if the slot exists
  const isSlotExist = await Slot.findById(id);
 
  if (!isSlotExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Slot not found');
  }

  // Check if the slot is already booked
  if (isSlotExist?.isBooked === true) {
    throw new AppError(httpStatus.CONFLICT, 'Slot already booked');
  }

  const isRoomExists = await Room.findById(payload?.room);

  if (!isRoomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }

  const result = await Slot.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

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
  getAvaiableSlotFromDB,getAllSlotFromDB,updateSingleSlotFromDB,deleteSingleSlotFromDB,getSingleSlotFromDB
};
