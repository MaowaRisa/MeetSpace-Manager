import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TRoom } from './room.interface';
import { Room } from './room.model';

const createRoomIntoDB = async (payload: TRoom) => {
  const result = await Room.create(payload);
  const newRoom = await Room.findById(result._id).select(
    '_id name roomNo floorNo capacity pricePerSlot amenities isDeleted',
  );
  return newRoom;
};
const getSingleRoomFromDB = async (id: string) => {
  const result = await Room.findOne({_id:id, isDeleted: false}).select(
    '_id name roomNo floorNo capacity pricePerSlot amenities isDeleted',
  );
  if(!result){
    throw new AppError(httpStatus.NOT_FOUND, "Room not found")
  }
  return result;
};
const getAllRoomsFromDB = async () => {
  const result = await Room.find({isDeleted: false}).select(
    '_id name roomNo floorNo capacity pricePerSlot amenities isDeleted',
  );
  if(result.length === 0){
    throw new AppError(httpStatus.NOT_FOUND, "No rooms available")
  }
  return result;
};
const updateRoomIntoDB = async (id: string, payload: Partial<TRoom>) => {
  const room = await Room.isRoomExists(id);
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }
  const updatedRoom = await Room.findByIdAndUpdate(id, payload, {
    new: true,
  }).select(
    '_id name roomNo floorNo capacity pricePerSlot amenities isDeleted',
  );
  return updatedRoom;
};
const deleteRoomFromDB = async (id: string) => {
  const room = await Room.isRoomExists(id);
  if (!room) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found');
  }
  const updatedRoom = await Room.findByIdAndUpdate(id, {isDeleted: true}, {
    new: true,
  }).select(
    '_id name roomNo floorNo capacity pricePerSlot amenities isDeleted',
  );
  return updatedRoom;
};
export const RoomServices = {
  createRoomIntoDB,
  getSingleRoomFromDB,
  getAllRoomsFromDB,
  updateRoomIntoDB,
  deleteRoomFromDB
};
