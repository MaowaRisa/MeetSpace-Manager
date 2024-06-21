import { Schema, model } from 'mongoose';
import { BookingModel, IBooking } from './booking.interface';

// Define the schema
const bookingSchema = new Schema<IBooking>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room is required'],
    },
    slots: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Slot',
        required: [true, 'Slots are required'],
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    totalAmount: {
      type: Number,
    },
    isConfirmed: {
      type: String,
      enum: ['confirmed', 'unconfirmed', 'canceled'],
      default: 'unconfirmed',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
bookingSchema.statics.isBookingExists = async function (id) {
  return await Booking.findOne({ _id: id, isDeleted: false });
};
bookingSchema.statics.isUserBookingExists = async function (
  userId,
  date,
  slots,
) {
  return await this.find({
    user: userId,
    date: new Date(date),
    slots: { $in: slots },
    isDeleted: false,
  });
};

export const Booking = model<IBooking, BookingModel>('Booking', bookingSchema);
