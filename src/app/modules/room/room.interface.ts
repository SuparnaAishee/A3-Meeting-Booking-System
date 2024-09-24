import { Model ,Types} from 'mongoose';

export type TRoom = {
  _id:Types.ObjectId;//string
  name: string;
  roomNo: number;
  floorNo: number;
  capacity: number;
  pricePerSlot: number;
  amenities: string[];
  isDeleted: boolean;
  image: [string];
  description?: string;
};
export interface RoomModel extends Model<TRoom> {
  // myStaticMethod():number;
  isRoomExistsByID(_id: Types.ObjectId): Promise<TRoom | null>;//string
}
