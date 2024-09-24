
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';
import { initiatePayment } from '../payment/payment.utils';

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.createBookingFromSlot(req.body);
const paymentLink = await initiatePayment();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User bookings created successfully',
      // data: result,
      data: {
        booking: result,
        paymentLink,
      },
    });
  
});

const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB();

  if (result.length === 0) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All bookings retrieved successfully',
      data: result,
    });
  }
});

const getMyBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getMyBookingsFromDB(req.user);

  if (result.length === 0) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User bookings retrieved successfully',
      data: result,
    });
  }
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
// Function to validate ObjectId
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

const deleteBooking = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid booking ID');
  }

  const result = await BookingServices.deleteBookingFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking deleted successfully',
    data: result,
  });
});
export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateSingleBooking,
  deleteBooking,
};
