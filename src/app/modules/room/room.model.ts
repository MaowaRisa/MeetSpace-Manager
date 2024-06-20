import { Schema, model } from 'mongoose';
import { RoomModel, TRoom } from './room.interface';

const roomSchema = new Schema<TRoom, RoomModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
      maxlength: [50, 'Name can not exceed 50 characters!'],
    },
    roomNo: {
      type: Number,
      required: [true, 'Room number is required'],
      unique: true,
    },
    floorNo: {
      type: Number,
      required: [true, 'Floor number is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Maximum number of people is required'],
    },
    pricePerSlot: {
      type: Number,
      required: [true, 'Price per slot is required'],
    },
    amenities:{
        type: [String],
        required: [true, "Amenities are required"]
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  },
);

roomSchema.statics.isRoomExists = async function (id) {
  return await Room.findOne({ _id: id, isDeleted: false });
};

export const Room = model<TRoom, RoomModel>('Room', roomSchema);
