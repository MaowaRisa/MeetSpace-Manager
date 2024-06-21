import { Schema, model } from 'mongoose';
import { SlotModel, TSlot } from './slot.interface';

const roomSchema = new Schema<TSlot, SlotModel>(
  {
    room: {
      type: Schema.Types.ObjectId,
      required: [true, 'Room is required!'],
      ref: 'Room',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

roomSchema.statics.isSlotExists = async function (id) {
  return await Slot.findOne({ _id: id, isBooked: false });
};

export const Slot = model<TSlot, SlotModel>('Slot', roomSchema);
