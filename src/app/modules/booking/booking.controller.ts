import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { Slot } from "../slots/slot.model";
import { Room } from "../room/room.model";
import { User } from "../user/user.model";
import { TBooking } from "./booking.interface";


const createBooking = catchAsync(async (req, res, next) => {
  const result = await BookingServices.createBookingFromSlot(req.body);
  const response = {
    _id: result._id,
    date: result.date,
    slots: result.slots,
    room: result.room,
    user: result.user,
    totalAmount: result.totalAmount,
    isConfirmed: result.isConfirmed,
  };

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Booking Created successfully',

    data:response,
  });
});

const getAllBookings =catchAsync(async(req,res,next)=>{
   const result = await BookingServices.getAllBookingsFromDB();
   sendResponse(res, {
     success: true,
     statusCode: 200,
     message: 'Booking retrieved successfully',

     data: result,
   });
});

const getMyBookings = catchAsync(async(req,res,next)=>{

const result = await BookingServices.getAllBookingsFromDB();
sendResponse(res, {
  success: true,
  statusCode: 200,
  message: 'My Booking retrieved successfully',

  data: result,
});
});
const updateSingleBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BookingServices.updateSingleBookingFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});
const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
 
  const result = await BookingServices.deleteBookingFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});


export const BookingControllers={
    createBooking,getAllBookings,getMyBookings,updateSingleBooking,deleteBooking
}
