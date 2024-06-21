import { Model, Types } from 'mongoose';
export interface TSlot {
  room: Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
export interface SlotModel extends Model<TSlot> {
  isSlotExists(id: string): Promise<TSlot | null>;
}
