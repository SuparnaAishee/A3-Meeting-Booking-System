import { Schema, model } from 'mongoose';
import { RoomModel, TRoom } from './room.interface';

const roomSchema = new Schema<TRoom>(
  {
    name: {
      type: String,
      required: true,
    },
    roomNo: {
      type: Number,
      required: true,
    },
    floorNo: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    pricePerSlot: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { versionKey: false },
);

roomSchema.statics.isRoomExistsByID = async function (_id: string) {
  return await Room.findOne({ _id });
};
export const Room = model<TRoom, RoomModel>('Room', roomSchema);
