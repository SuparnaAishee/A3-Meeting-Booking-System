import { Model } from "mongoose";

export type TRoom={
    _id:string;
    name:string;
    roomNo:number;
    floorNo:number;
    capacity:number;
    pricePerSlot:number;
    amenities:string[];
    isDeleted:boolean
};
export interface RoomModel extends Model<TRoom> {
  // myStaticMethod():number;
  isRoomExistsByID(_id: string): Promise<TRoom>;
}
