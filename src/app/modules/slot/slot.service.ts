import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import { generateSlots, hasConflict } from './slot.utils';

const createSlotIntoDB = async (payload: TSlot) => {
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

  const selectedFields = '_id room date startTime endTime isBooked';
  const insertedSlotIds = slotsData.map((slot) => slot._id);
  const result = await Slot.find({ _id: { $in: insertedSlotIds } }).select(
    selectedFields,
  );

  return result;
};
export const SlotServices = {
  createSlotIntoDB,
};
