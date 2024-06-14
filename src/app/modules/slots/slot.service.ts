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
  // Check if room exists by _id using the static method
 const isroomExists = await Room.findById(room);

 if (!isroomExists) {
   throw new AppError(httpStatus.NOT_FOUND, 'Room not found !');
 }

 const isRoomDeleted = isroomExists?.isDeleted;
 if (isRoomDeleted) {
   throw new AppError(httpStatus.NOT_FOUND, 'Room is deleted!');
 }
 

  // slot time
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

const getAvaiableSlotFromDB = async(query:Record<string,unknown>)=>{
const{roomId,date}=query;
const queryObject: Record<string, unknown> = {};
    if (date && roomId) {
      query.date = date;
      query.room = roomId;
    }

    const getAvailableSlots = await Slot.find(query).populate('room');
   
    return getAvailableSlots;

}

export const SlotServices ={
createSlotIntoDB,getAvaiableSlotFromDB
}