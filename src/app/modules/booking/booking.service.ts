import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IBooking } from './booking.interface';
import { Room } from '../room/room.model';
import {
  checkRoomAndDateInSlots,
  checkSlotsAvailability,
  checkSlotsExistence,
  checkUserBooking,
  convertObjectIdsToStrings,
} from './booking.utils';
import { Booking } from './booking.model';
import { selectedFieldsForSlot } from '../slot/slot.constants';
import { selectedFieldsForRoom } from '../room/room.constants';
import { selectedFieldsForUser } from '../user/user.constants';

const selectedFieldsBooking = '_id date slots room user totalAmount isConfirmed isDeleted';

const createBookingIntoDB = async (email: string, payload: IBooking) => {
  // check the user exist and check the provided id is belong to login user
  const isUserExist = await User.findById({ _id: payload.user });
  if (isUserExist?.email !== email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication check failed!');
  }
  // Slots exist
  const missingSlots = await checkSlotsExistence(payload.slots);
  if (missingSlots.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${missingSlots.join(',')} slots already booked!`,
    );
  }
  // Room exist
  const isRoomExists = await Room.isRoomExists(payload.room.toString());
  if (!isRoomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found!');
  }
  // check if the user have booking on same day same slots
  const isBookingAlreadyAvailable = await checkUserBooking(
    payload.user.toString(),
    payload.date.toString(),
    convertObjectIdsToStrings(payload.slots),
  );
  if (isBookingAlreadyAvailable.length > 0) {
    throw new AppError(
      httpStatus.CONFLICT,
      `You have booking for these slots on the same date. booking Ids: ${isBookingAlreadyAvailable.join(',')}`,
    );
  }
  // check if the slots are available for a room on a given date.
  const unavailableSlots = await checkSlotsAvailability(
    payload.room.toString(),
    payload.date.toString(),
    convertObjectIdsToStrings(payload.slots),
  );
  if (unavailableSlots.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Unavailable slot IDs:, ${unavailableSlots.join(',')}`,
    );
    return;
  }
  // check if the date and room provided matched with slots
  const {foundSlotsIds, missingSlotsIds} = await checkRoomAndDateInSlots(
    payload.room.toString(),
    payload.date.toString(),
    convertObjectIdsToStrings(payload.slots),
  );

  if (missingSlotsIds.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${missingSlotsIds.join(',')} slots not found for the given room and date.`,
    );
  }

//calculate total amount
const totalAmount = foundSlotsIds.length * isRoomExists.pricePerSlot;
  const newBooking = await Booking.create({...payload, totalAmount});
  const result = await Booking.findById(newBooking._id).select(selectedFieldsBooking).populate({
    path: 'slots',
    select: selectedFieldsForSlot
  }).populate({
    path: 'room',
    select: selectedFieldsForRoom
  }).populate({
    path: 'user',
    select: selectedFieldsForUser
  })
  return result;
};
const getAllBookingsFromDB = async() =>{
     const result = await Booking.find();
     return result
}
export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB
};
