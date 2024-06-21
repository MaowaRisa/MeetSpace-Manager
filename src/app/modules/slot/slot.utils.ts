import { TSlot } from './slot.interface';

const getTimeFromMinutes = (minutesSinceMidnight: number) => {
  const hours = Math.floor(minutesSinceMidnight / 60) % 24; // after 24 hours
  const minutes = minutesSinceMidnight % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
export const generateSlots = (payload: TSlot) => {
  //   const [startHour, startMinute] = payload.startTime.split(':').map(Number);
  const [endHour, endMinute] = payload.endTime.split(':').map(Number);

  const startMinutesSinceMidnight = convertToMinutes(payload.startTime);
  const endMinutesSinceMidnight =
    endHour === 0 && endMinute === 0 ? 1440 : endHour * 60 + endMinute; // Handle "00:00" as "24:00" or "1440" minutes

  let totalDuration = endMinutesSinceMidnight - startMinutesSinceMidnight;
  if (totalDuration <= 0) {
    totalDuration += 1440;
  }
  const slotDuration = 60;

  const numberOfSlots = Math.floor(totalDuration / slotDuration);
  const slots: TSlot[] = [];

  for (let i = 0; i < numberOfSlots; i++) {
    const slotStartTime = getTimeFromMinutes(
      startMinutesSinceMidnight + i * slotDuration,
    );
    const slotEndTime = getTimeFromMinutes(
      startMinutesSinceMidnight + (i + 1) * slotDuration,
    );

    slots.push({
      room: payload.room,
      date: payload.date,
      startTime: slotStartTime,
      endTime: slotEndTime === '00:00' ? '23:59' : slotEndTime, // slots in the same day
      isBooked: false,
    });
  }
  return slots;
};
const convertToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const hasConflict = (
  slots: TSlot[],
  startTime: string,
  endTime: string,
): boolean => {
  const startMinutes = convertToMinutes(startTime);
  const endMinutes = convertToMinutes(endTime);

  return slots.some((slot) => {
    const slotStartMinutes = convertToMinutes(slot.startTime);
    const slotEndMinutes = convertToMinutes(slot.endTime);
    // Check for overlap
    return startMinutes < slotEndMinutes && endMinutes > slotStartMinutes;
  });
};
