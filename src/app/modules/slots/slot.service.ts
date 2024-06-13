import { Request } from "express";
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import { generateSlots } from "./slot.constant";

const createSlotIntoDB = async (payload:TSlot , req: Request) => {
  const { room, date, startTime, endTime, isBooked = false } = payload;

  // slot time 
  const slotDuration = 60; 
  const slots = generateSlots(startTime, endTime, slotDuration);

  // Maping slots 
  const slotsDetails = slots.map(slot => ({
    room,
    date: date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isBooked,
  }));

 
  const createdSlots = await Slot.insertMany(slotsDetails);

  return createdSlots;
}

export const SlotServices ={
createSlotIntoDB
}