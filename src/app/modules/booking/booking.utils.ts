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
export async function checkRoomAndDateInSlots(
  roomId: string,
  date: string,
  slots: string[]
) {
  const foundSlots = await Slot.find({
    _id: { $in: slots },
    room: roomId,
    date: date,
  });
  const foundSlotsIds = foundSlots.map(slot => slot._id.toString())
  const missingSlotsIds = slots.filter(slotId => !foundSlotsIds.includes(slotId.toString()));

  return {foundSlotsIds, missingSlotsIds};
}
