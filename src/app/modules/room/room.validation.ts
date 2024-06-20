import { z } from 'zod';

const createRoomValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().max(50, 'Name can not exceed 50 characters!'),
    roomNo: z.number().int().positive('Room number must be a positive integer'),
    floorNo: z
      .number()
      .int()
      .positive('Floor number must be a positive integer'),
    capacity: z.number().int().positive('Capacity must be a positive integer'),
    pricePerSlot: z
      .number()
      .positive('Price per slot must be a positive number'),
    amenities: z.array(z.string()),
    isDeleted: z.boolean().optional().default(false),
  }),
});
const updateRoomValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .max(50, 'Name can not exceed 50 characters!')
      .optional(),
    roomNo: z
      .number()
      .int()
      .positive('Room number must be a positive number')
      .optional(),
    floorNo: z
      .number()
      .int()
      .positive('Floor number must be a positive number')
      .optional(),
    capacity: z
      .number()
      .int()
      .positive('Capacity must be a positive number')
      .optional(),
    pricePerSlot: z
      .number()
      .positive('Price per slot must be a positive number')
      .optional(),
    amenities: z.array(z.string()).optional(),
    isDeleted: z.boolean().optional().default(false),
  }),
});
export const roomValidation = {
  createRoomValidationSchema,
  updateRoomValidationSchema
};
