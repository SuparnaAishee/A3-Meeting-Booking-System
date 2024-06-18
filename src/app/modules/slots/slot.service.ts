
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
const getAvaiableSlotFromDB = async (query: Record<string, unknown>) => {
  const { roomId, date } = query 

  const queryObject: Record<string, unknown> = {};

  if (date) {
    queryObject.date = date;
  }
  
  if (roomId) {
    queryObject.room = roomId;
  }
  const availableSlots = await Slot.find(queryObject).populate('room');
  
  // Filter out slots that are booked

  const filteredSlots = availableSlots.filter((slot) => !slot.isBooked);
  return filteredSlots;
};

export const SlotServices = {
  createSlotIntoDB,
  getAvaiableSlotFromDB,
};
