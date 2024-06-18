import { Schema } from 'mongoose';

export type TBooking = {
  room: Schema.Types.ObjectId;
  slots: Schema.Types.ObjectId[];
  user: Schema.Types.ObjectId;
  date: string;
  totalAmount: number;
  isConfirmed: 'confirmed' | 'unconfirmed' | 'canceled';
  isDeleted: boolean;
};
