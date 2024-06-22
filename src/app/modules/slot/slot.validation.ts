import { z } from 'zod';
// check if a date is today or in the future
export const todayOrLaterDateRefinement = (date: z.ZodString) =>
  date.refine(
    (value) => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set current time to start of today (midnight)
      const inputDate = new Date(value);
      return inputDate >= now;
    },
    {
      message: 'choose today or any day after today',
    },
  );
const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
    return regex.test(time);
  },
  {
    message: 'Invalid time format, expected "HH:MM" in 24 hours format',
  },
);
const createSlotValidationSchema = z.object({
  body: z
    .object({
      room: z.string(),
      date: todayOrLaterDateRefinement(z.string()),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      isBooked: z.boolean().optional().default(false),
    })
    .refine(
      (body) => {
        // 24:00 is not valid time in JS
        if (body.endTime === '00:00') {
          return false;
        }
        if (body.endTime === '24:00' || body.endTime === '00:00') {
          body.endTime = '23:59';
        }

        return body.endTime > body.startTime;
      },
      {
        message: 'Start time should be before end time! for 24 use 23:59',
      },
    ),
});
const updateSlotValidationSchema = z.object({
  body: z
    .object({
      room: z.string().optional(),
      date: todayOrLaterDateRefinement(z.string()).optional(),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
      isBooked: z.boolean().optional().default(false),
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}`);
        const end = new Date(`1970-01-01T${body.endTime}`);
        return end > start;
      },
      {
        message: 'Start time should be before end time!',
      },
    ),
});
export const slotValidation = {
  createSlotValidationSchema,
  updateSlotValidationSchema,
};
