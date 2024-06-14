import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Slot } from "../slots/slot.model";
import { TBooking } from "./booking.interface";
import { Booking, BookingStatus } from "./booking.model";
import { Room } from "../room/room.model";
import { User } from "../user/user.model";
import mongoose, { Document } from 'mongoose';
const createBookingFromSlot = async (
  payload: TBooking,
) => {
  const { room, slots, user, date } = payload;

  // Checking date exists in any slot
  const isDateExists = await Slot.exists({ date });
  if (!isDateExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No slots found for the given date',
    );
  }

  // Validate each slot
  for (const slotId of slots) {
    const slot = await Slot.findById(slotId);
    if (!slot || slot.isDeleted || slot.isBooked) {
      throw new Error(`Slot ${slotId} is not available`);
    }
  }

  // Checking  room exists and  not deleted
  const roomInfo = await Room.findById(room);
  if (!roomInfo || roomInfo.isDeleted) {
    throw new Error('Room not found or is deleted');
  }

  // Checking if the user exists
  const userInfo = await User.findById(user);
  if (!userInfo) {
    throw new Error('User not found');
  }

  //  slot array can not empty
  if (!slots || slots.length === 0) {
    throw new Error('Slots array cannot be empty');
  }
  // Calculate total amount
  const perSlotPrice = roomInfo.pricePerSlot;
  const totalAmount = slots.length * perSlotPrice;
  // Create booking
  const createdBooking = await Booking.create({
    date,
    slots,
    room,
    user,
    totalAmount,
    isConfirmed: 'unconfirmed',
  });
  const booking = await Booking.findById(createdBooking._id)
    .populate('room')
    .populate('slots')
    .populate('user');
  return booking;
};

const getAllBookingsFromDB=async()=>{
 const allBooking = await Booking.find()
   .populate('room')
   .populate('slots')
   .populate('user');
 return allBooking;
};

const getMyBookingsFromDB= async(payload:TBooking,userId: mongoose.Types.ObjectId)=>{
 const myBooking = await Booking.find({user:userId})
  
    .populate('room')
    .populate('slots')
    .populate('user')
    .exec();

  return myBooking;
};
const updateSingleBookingFromDB = async (id: string) => {
  const isBookingExist = await Booking.findById(id);

  if (!isBookingExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  //checking isDeleted or not
  const isDeletedBooking = isBookingExist?.isDeleted;

  if (isDeletedBooking) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Booking is already deleted');
  }

  const result = await Booking.findByIdAndUpdate(
    id,
    { isConfirmed: 'confirmed' },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};


const deleteBookingFromDB = async (id: string) => {
  const result = await Booking.findByIdAndUpdate(
    id,
   
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};


export const BookingServices = {
  createBookingFromSlot,
 getAllBookingsFromDB,getMyBookingsFromDB,updateSingleBookingFromDB,deleteBookingFromDB
};