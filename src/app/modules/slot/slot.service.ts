import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { QueryParameters, TSlot } from './slot.interface';
import { Slot } from './slot.model';
import { generateSlots, hasConflict } from './slot.utils';
import { Room } from '../room/room.model';
import { selectedFieldsForSlot } from './slot.constants';
import { selectedFieldsForRoom } from '../room/room.constants';

const createSlotIntoDB = async (payload: TSlot) => {
  // check if room available
  const isRoomExists = await Room.isRoomExists(payload.room.toString());
  if (!isRoomExists) {
    throw new AppError(httpStatus.NOT_FOUND, `Room not found!`);
  }
  // Generates Slots
  const slots: TSlot[] = generateSlots(payload);
  // check if already the room slots created for the date
  const isRoomSlotsAvailableForThisDate = await Slot.find({
    room: payload.room,
    date: payload.date,
  }).sort({ startTime: 1 });
  // check
  if (
    hasConflict(
      isRoomSlotsAvailableForThisDate,
      payload.startTime,
      payload.endTime,
    )
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This room slots ${payload.startTime} to ${payload.endTime} are already created or has time conflicts on ${payload.date}`,
    );
  }
  const slotsData = await Slot.insertMany(slots);

  const insertedSlotIds = slotsData.map((slot) => slot._id);
  const result = await Slot.find({ _id: { $in: insertedSlotIds } }).select(
    selectedFieldsForSlot,
  );

  return result;
};
const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
  const { date, roomId, ...rest } = query as { date?: string; roomId?: string };

  // Check for unexpected query parameters
  const extraParams = Object.keys(rest);

  if (extraParams.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Invalid query parameters: ${extraParams.join(', ')}. Only 'date' and 'roomId' are allowed.`,
    );
  }
  const queryData: QueryParameters = { isBooked: false };

  if (date) {
    queryData.date = date + 'T00:00:00.000Z';
  }
  if (roomId) {
    queryData.room = roomId;
  }
  const result = await Slot.find(queryData)
    .select(selectedFieldsForSlot)
    .populate({
      path: 'room',
      select: selectedFieldsForRoom,
    });
  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No slots available');
  }
  return result;
};
export const SlotServices = {
  createSlotIntoDB,
  getAvailableSlotsFromDB,
};
