// import { Schema, Types, model } from 'mongoose';
// import { RoomModel, TRoom } from './room.interface';

// const roomSchema = new Schema<TRoom>(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     roomNo: {
//       type: Number,
//       required: true,
//     },
//     floorNo: {
//       type: Number,
//       required: true,
//     },
//     capacity: {
//       type: Number,
//       required: true,
//     },
//     pricePerSlot: {
//       type: Number,
//       required: true,
//     },
//     amenities: {
//       type: [String],
//       required: true,
//     },
//     isDeleted: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     image: {
//       type: [String],
//       required: true,
//     },
//     description: { type: String, default: '' },
//   },
//   { versionKey: false },
// );

// // roomSchema.statics.isRoomExistsByID = async function (_id: string) {
// //   return await Room.findOne({ _id });
// // };
// // Static method implementation
// roomSchema.statics.isRoomExistsByID = async function (_id: Types.ObjectId | string) {
//   return await this.findOne({ _id: _id instanceof Types.ObjectId ? _id : new Types.ObjectId(_id) });
// };
// export const Room = model<TRoom, RoomModel>('Room', roomSchema);
import { Schema, Types, model } from 'mongoose';
import { RoomModel, TRoom } from './room.interface';

// Room schema definition
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
    image: {
      type: [String],
      required: true,
    },
    description: { type: String, default: '' },
  },
  { collection: 'rooms', versionKey: false },
);

// Static method to check if a room exists by ID
roomSchema.statics.isRoomExistsByID = async function (
  _id: Types.ObjectId | string,
) {
  console.log('Received ID:', _id); // Debugging line

  // Validate the ObjectId format
  if (typeof _id === 'string' && !/^[0-9a-fA-F]{24}$/.test(_id)) {
    throw new Error('Invalid ObjectId format');
  }

  // Create ObjectId only if necessary
  const objectId =
    _id instanceof Types.ObjectId ? _id : new Types.ObjectId(_id);

  // Check if the room exists in the database
  return await this.findOne({ _id: objectId });
};

// Export the Room model
export const Room = model<TRoom, RoomModel>('Room', roomSchema);
