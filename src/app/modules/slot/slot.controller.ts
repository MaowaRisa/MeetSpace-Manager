import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import { SlotServices } from './slot.service';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';

const createSlot: RequestHandler = catchAsync(async (req, res) => {
  const result = await SlotServices.createSlotIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slots created successfully',
    data: result,
  });
});
export const SlotControllers = {
  createSlot,
};
