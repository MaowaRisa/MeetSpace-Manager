/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { IBooking } from './booking.interface';
import { Room } from '../room/room.model';
import {
  arraysHaveSameObjectIds,
  // arraysHaveSameObjectIds,
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
import mongoose from 'mongoose';
import { Slot } from '../slot/slot.model';
import { selectedFieldsForBooking } from './booking.constants';

const createBookingIntoDB = async (email: string, payload: IBooking) => {
  // Check if the user exists and check if the provided id belongs to the logged-in user
  const isUserExist = await User.findById({ _id: payload.user });
  if (isUserExist?.email !== email) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication check failed!');
  }
  // Slots exist
  const missingSlots = await checkSlotsExistence(payload.slots);
  if (missingSlots.length > 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${missingSlots.join(',')} slots are not available!`,
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
  const { foundSlotsIds, missingSlotsIds } = await checkRoomAndDateInSlots(
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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newBooking = await Booking.create([{ ...payload, totalAmount }], {
      session,
    });
    if (!newBooking) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create booking.');
    }
    // update slots are booked

    const slotsBooked = await Slot.updateMany(
      { _id: { $in: foundSlotsIds } },
      { $set: { isBooked: true } },
      { session },
    );
    if (!slotsBooked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update slots booking status.',
      );
    }
    const result = await Booking.findOne({ _id: newBooking[0]._id })
      .select(selectedFieldsForBooking)
      .populate({
        path: 'slots',
        select: selectedFieldsForSlot,
      })
      .populate({
        path: 'room',
        select: selectedFieldsForRoom,
      })
      .populate({
        path: 'user',
        select: selectedFieldsForUser,
      })
      .session(session);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Transaction aborted');
  }
};
const getAllBookingsFromDB = async () => {
  const result = await Booking.find({ isDeleted: false })
    .select(selectedFieldsForBooking)
    .populate({
      path: 'slots',
      select: selectedFieldsForSlot,
    })
    .populate({
      path: 'room',
      select: selectedFieldsForRoom,
    })
    .populate({
      path: 'user',
      select: selectedFieldsForUser,
    });
  return result;
};
const getBookingsByUserFromDB = async (email: string) => {
  const isUserExist = await User.isUserExistsByEmail(email);
  const results = await Booking.findOne({
    user: isUserExist?._id,
    isDeleted: false,
  })
    .select(selectedFieldsForBooking)
    .populate({
      path: 'slots',
      select: selectedFieldsForSlot,
    })
    .populate({
      path: 'room',
      select: selectedFieldsForRoom,
    })
    .populate({
      path: 'user',
      select: selectedFieldsForUser,
    });
  return results;
};

const updateBookingIntoDB = async (
  bookingId: string,
  email: string,
  payload: Partial<IBooking>,
) => {
  // Find the existing booking
  const isBookingExists = await Booking.findOne({
    _id: bookingId,
    isDeleted: false,
  });
  if (!isBookingExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!');
  }

  // Check if the logged-in person is admin
  const isAdmin = await User.findOne({ email: email });
  if (!isAdmin || isAdmin.role !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication check failed!');
  }
  // check if the dates have slots

  // Slots exist - check only slots in payload if given
  if (payload.slots && payload.slots.length > 0) {
    const missingSlots = await checkSlotsExistence(payload.slots ?? []);
    if (
      missingSlots.length > 0 &&
      !arraysHaveSameObjectIds(missingSlots, isBookingExists.slots)
    ) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `${missingSlots.join(',')} slots already booked!`,
      );
    }
  }

  // Room exist
  const roomId = payload.room?.toString() ?? isBookingExists.room.toString();
  const isRoomExists = await Room.isRoomExists(roomId);
  if (!isRoomExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Room not found!');
  }

  // Check if the user has booking on the same day same slots
  const isBookingAlreadyAvailable = await checkUserBooking(
    isBookingExists.user.toString(),
    payload.date?.toString() ?? isBookingExists.date.toString(),
    convertObjectIdsToStrings(payload.slots ?? isBookingExists.slots),
  );

  // Handle type comparison between ObjectId and string
  const bookingIdString = bookingId.toString();
  if (
    isBookingAlreadyAvailable.length > 0 &&
    isBookingAlreadyAvailable.some((id) => id?.toString() !== bookingIdString)
  ) {
    throw new AppError(
      httpStatus.CONFLICT,
      `You have booking for these slots on the same date. booking Ids: ${isBookingAlreadyAvailable.join(',')}`,
    );
  }

  // Check if the slots are available for a room on a given date
  const unavailableSlots = await checkSlotsAvailability(
    roomId,
    payload.date?.toString() ?? isBookingExists.date.toString(),
    convertObjectIdsToStrings(payload.slots ?? isBookingExists.slots),
  );
  if (
    unavailableSlots.length > 0 &&
    unavailableSlots.some((slot) => !isBookingExists.slots.includes(slot))
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Unavailable slot IDs: ${unavailableSlots.join(',')}`,
    );
  }

  // Check if the date and room provided matched with slots
  const { foundSlotsIds, missingSlotsIds } = await checkRoomAndDateInSlots(
    roomId,
    payload.date?.toString() ?? isBookingExists.date.toString(),
    convertObjectIdsToStrings(payload.slots ?? isBookingExists.slots),
  );
  if (
    missingSlotsIds.length > 0 &&
    missingSlotsIds.some(
      (slot) => !isBookingExists.slots.map((s) => s.toString()).includes(slot),
    )
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${missingSlotsIds.join(',')} slots not found for the given room and date.`,
    );
  }

  // Calculate total amount
  const totalAmount = foundSlotsIds.length * isRoomExists.pricePerSlot;

  // Update the booking
  const updatedBookingData = {
    ...payload,
    totalAmount,
  };

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedBookingData,
      { new: true, session },
    ).select(selectedFieldsForBooking);

    if (!updatedBooking) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update booking');
    }
    // Updates slots booking status
    const slotsBooked = await Slot.updateMany(
      { _id: { $in: foundSlotsIds } },
      { $set: { isBooked: true } },
      { session },
    );
    if (!slotsBooked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update slots booking status.',
      );
    }

    await session.commitTransaction();
    return updatedBooking;
  } catch (err: any) {
    await session.abortTransaction();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Transaction aborted');
  } finally {
    session.endSession();
  }
};
const deleteBookingFromDB = async (bookingId: string, email: string) => {
  // Find the existing booking
  const isBookingExists = await Booking.findOne({
    _id: bookingId,
    isDeleted: false,
  });
  if (!isBookingExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found!');
  }

  // Check if the logged-in person is admin
  const isAdmin = await User.findOne({ email: email });
  if (!isAdmin || isAdmin.role !== 'admin') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication check failed!');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Booking.findByIdAndUpdate(
      { _id: bookingId },
      { isDeleted: true },
      { new: true, session },
    ).select(selectedFieldsForBooking);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete booking');
    }
    // slots booking status
    const slotsBooked = await Slot.updateMany(
      { _id: { $in: isBookingExists.slots } },
      { $set: { isBooked: false } },
      { session },
    );
    if (!slotsBooked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update slots booking status',
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Transaction aborted!',
    );
  }
};
export const BookingServices = {
  createBookingIntoDB,
  getAllBookingsFromDB,
  getBookingsByUserFromDB,
  updateBookingIntoDB,
  deleteBookingFromDB,
};
