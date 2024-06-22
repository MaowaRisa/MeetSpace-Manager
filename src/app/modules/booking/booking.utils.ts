import { Types } from 'mongoose';
import { Slot } from '../slot/slot.model';
import { Booking } from './booking.model';

export async function checkSlotsExistence(slots: Types.ObjectId[]) {
  const missingSlots = [];

  for (const slotId of slots) {
    const isSlotExists = await Slot.isSlotExists(slotId.toString());

    if (!isSlotExists) {
      missingSlots.push(slotId);
    }
  }

  return missingSlots;
}
export async function checkSlotsAvailability(
  roomId: string,
  date: string,
  slots: string[],
) {
  const bookings = await Booking.find({
    room: roomId,
    date: date,
    slots: { $in: slots },
    isDeleted: false,
  });

  const unavailableSlots = [];
  for (const booking of bookings) {
    for (const slot of booking.slots) {
      unavailableSlots.push(slot);
    }
  }

  return unavailableSlots;
}
export async function checkUserBooking(
  userId: string,
  date: string,
  slots: string[],
) {
  const userBookings = await Booking.isUserBookingExists(userId, date, slots);
  return userBookings?.map((booking) => booking._id);
}
export function convertObjectIdsToStrings(
  objectIds: Types.ObjectId[],
): string[] {
  return objectIds.map((objectId) => objectId.toString());
}
// const normalizeDate = (dateString: string) => {
//   const date = new Date(dateString);
//   date.setHours(0, 0, 0, 0);
//   return date;
// };
export async function checkRoomAndDateInSlots(
  roomId: string,
  date: string,
  slots: string[],
) {
  const foundSlots = await Slot.find({
    _id: { $in: slots },
    room: roomId,
    isBooked: false,
    date: date,
  });
  //   console.log('this', foundSlots);
  const foundSlotsIds = foundSlots.map((slot) => slot._id.toString());
  const missingSlotsIds = slots.filter(
    (slotId) => !foundSlotsIds.includes(slotId.toString()),
  );

  return { foundSlotsIds, missingSlotsIds };
}
// Function to compare two arrays of ObjectIds
export const arraysHaveSameObjectIds = (
  arr1: Array<string | Types.ObjectId>,
  arr2: Array<string | Types.ObjectId>,
) => {
  if (arr1.length !== arr2.length) return false;

  // Convert each ObjectId to a string
  const arr1Strings = arr1.map((id) => id.toString());
  const arr2Strings = arr2.map((id) => id.toString());

  // Sort the arrays
  arr1Strings.sort();
  arr2Strings.sort();

  // Compare sorted arrays
  for (let i = 0; i < arr1Strings.length; i++) {
    if (arr1Strings[i] !== arr2Strings[i]) {
      return false;
    }
  }
  return true;
};
