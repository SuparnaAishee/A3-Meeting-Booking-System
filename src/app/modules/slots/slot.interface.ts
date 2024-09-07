import { Types } from "mongoose";
import { TRoom } from "../room/room.interface";


export type TSlot = {
  _id: string;
  room: Types.ObjectId|TRoom;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
  isDeleted?: boolean;
};
