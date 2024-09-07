import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SlotServices } from './slot.service';

const createSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.createSlotIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Slots Created successfully',

    data: result,
  });
});

const getAllSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.getAllSlotFromDB();

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
      message: 'All slots retrieved successfully',
      data: result,
    });
  }
});



const avaiableSlot = catchAsync(async (req, res) => {
  const result = await SlotServices.getAvaiableSlotFromDB(req.query);

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
      message: 'Available slots retrieved successfully',
      data: result,
    });
  }
});
export const slotControllers = {
  createSlot,
  avaiableSlot,getAllSlot
};
