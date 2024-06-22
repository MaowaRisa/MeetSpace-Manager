import { z } from 'zod';
import { todayOrLaterDateRefinement } from '../slot/slot.validation';

const createBookingValidationSchema = z.object({
  body: z.object({
    room: z.string(),
    slots: z.array(z.string()),
    user: z.string(),
    date: todayOrLaterDateRefinement(z.string()),
    totalAmount: z.number().optional(),
    isConfirmed: z
      .enum(['confirmed', 'unconfirmed', 'canceled'])
      .default('unconfirmed'),
    isDeleted: z.boolean().optional().default(false),
  }),
});

const updateBookingValidationSchema = z.object({
    body: z.object({
      room: z.string().optional(),
      slots: z.array(z.string()).optional(),
      user: z.string().optional(),
      date: todayOrLaterDateRefinement(z.string()).optional(),
      totalAmount: z.number().optional(),
      isConfirmed: z
        .enum(['confirmed', 'unconfirmed', 'canceled'])
        .default('unconfirmed').optional(),
      isDeleted: z.boolean().optional().default(false),
    }),
  });

export const BookingValidationSchema = {
  createBookingValidationSchema,
  updateBookingValidationSchema
};
