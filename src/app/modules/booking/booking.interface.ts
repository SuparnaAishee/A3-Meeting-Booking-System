import  { Schema } from 'mongoose';
import { BookingStatus } from './booking.model';
// import { BookingStatus } from './booking.model';

export type TBooking = {
  room: Schema.Types.ObjectId;
  slots: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId;
  date: string;
  totalAmount: number;
  isConfirmed: BookingStatus;
  isDeleted: boolean;
  promoCode?: string;
  discountAmount?: number;
  transactionId?: string;
};
