
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingServices } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
  const result = await BookingServices.createBookingFromSlot(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User bookings created successfully',
      data: result,
    });
  
});


const getAllBookings = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Booking retrieved successfully',

    data: result,
  });
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

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateSingleBooking,
  deleteBooking,
};
