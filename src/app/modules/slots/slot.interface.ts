import mongoose from 'mongoose';

export type TSlot = {
  _id: string;
  room: mongoose.Schema.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  isDeleted?: boolean;
};
