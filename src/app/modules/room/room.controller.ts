import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';
import { RoomServices } from './room.service';

const createRoom: RequestHandler = catchAsync(async (req, res) => {
  const result = await RoomServices.createRoomIntoDB(req.body);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Room added successfully',
      data: result,
    });
  }
});
const updateRoom: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomServices.updateRoomIntoDB(id, req.body);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Room updated successfully',
      data: result,
    });
  }
});
const deleteRoom: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomServices.deleteRoomFromDB(id);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Room deleted successfully',
      data: result,
    });
  }
});
const getSingleRoom: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomServices.getSingleRoomFromDB(id);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Room retrieved successfully',
      data: result,
    });
  }
});
const getAllRooms: RequestHandler = catchAsync(async (req, res) => {
  const result = await RoomServices.getAllRoomsFromDB();
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Rooms retrieved successfully',
      data: result,
    });
  }
});

export const RoomControllers = {
  createRoom,
  getSingleRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
