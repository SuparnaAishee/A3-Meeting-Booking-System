// import { Schema, model } from 'mongoose';
// import { TBooking } from './booking.interface';


// export enum BookingStatus {
//   confirmed = 'confirmed',
//   unconfirmed = 'unconfirmed',
//   canceled = 'canceled',
// }

// const bookingSchema = new Schema<TBooking>(
//   {
//     slots: [{ type: Schema.Types.ObjectId, ref: 'Slot', required: true }],
//     room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

//     date: { type: String, required: true },
//     totalAmount: { type: Number },
//     isConfirmed: {
//       type: String,
//       enum: Object.values(BookingStatus),
//       default: BookingStatus.unconfirmed,
//     },

//     isDeleted: { type: Boolean, default: false },
   
//   },
//   { versionKey: false },
// );



// export const Booking = model<TBooking>('Booking', bookingSchema);
import { Schema,  model } from 'mongoose';
import { TBooking } from './booking.interface';

export enum BookingStatus {
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
  canceled = 'canceled',
}

const bookingSchema = new Schema<TBooking>(
  {
    slots: [{ type: Schema.Types.ObjectId, ref: 'Slot', required: true }],
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    totalAmount: { type: Number },

    // Added fields for promo code and discount
    promoCode: { type: String }, // To store the promo code entered by the user
    discountAmount: { type: Number, default: 0 }, // To store the discount amount applied
    transactionId: { type: String },

    isConfirmed: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.unconfirmed,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { versionKey: false },
);

export const Booking = model<TBooking>('Booking', bookingSchema);
