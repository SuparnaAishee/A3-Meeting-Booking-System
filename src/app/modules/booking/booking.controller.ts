import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req, res, next) => {
  const result = await BookingServices.createBookingFromSlot(req.body, req);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slots Created successfully',

    data: result,
  });
});

export const BookingControllers={
    createBooking
}
