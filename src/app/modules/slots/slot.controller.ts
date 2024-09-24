import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {  getAvailableSlotFromDB, SlotServices } from './slot.service';

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
//avaiable slot
export const getAvailableSlots = catchAsync(
  async (req, res) => {
    const { roomId, date } = req.query;

    // Build the query object
    const query: Record<string, unknown> = {};
    if (roomId) query.roomId = roomId;
    if (date) query.date = date;

    // Fetch the available slots from the database
    const result = await getAvailableSlotFromDB(query);

    // Send the response
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Available slots fetched successfully',
      data: result,
    });
  },
);

//////


const updateSingleslot = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SlotServices.updateSingleSlotFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Slot updated successfully',
    data: result,
  });
});

const deleteSingleSlot = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await SlotServices.deleteSingleSlotFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Slot deleted successfully',
    data: result,
  });
});

const getSingleSlot = catchAsync(async (req, res) => {
  const { id } = req.params;



  const result = await SlotServices.getSingleSlotFromDB(id);

  if (!result) {
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
      message: 'slot retrieved successfully',
      data: result,
    });
  }
});


export const slotControllers = {
  createSlot,
  getAvailableSlots,getAllSlot,updateSingleslot,deleteSingleSlot,getSingleSlot
};
