import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SlotServices } from "./slot.service";


const createSlot = catchAsync(async(req,res,next)=>{
    const result = await SlotServices.createSlotIntoDB(req.body, req);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Slots Created successfully',

      data: result,
    });
});

const avaiableSlot = catchAsync(async(req,res,next)=>{
  
    const result = await SlotServices.getAvaiableSlotFromDB(req.body);
    
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Retrived avaiable slots successfully',

      data: result,
    });
});

export const slotControllers={
     createSlot,avaiableSlot
}