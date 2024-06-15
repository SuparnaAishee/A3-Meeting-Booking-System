import { Request } from "express";
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import { generateSlots } from "./slot.constant";
import { Room } from "../room/room.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TRoom } from "../room/room.interface";

const createSlotIntoDB = async (payload:TSlot,req: Request) => {
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
      'Slots already exist for this time range!',
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
  const { roomId, date } = query;

 
    const queryObject: Record<string, unknown> = {};

    if (date && roomId) {
      queryObject.date = date;
      queryObject.room = roomId;
    }

    const availableSlots = await Slot.find(queryObject).populate('room');

    // Check conditions for each slot
    availableSlots.forEach((slot) => {
      // Check if slot is confirmed
      if (slot.isBooked) {
        throw new AppError(
          400,
          `Slot ${slot._id} is already confirmed and cannot be booked.`,
        );
      }
      
    });

    return availableSlots;
  
};

export const SlotServices ={
createSlotIntoDB,getAvaiableSlotFromDB
}