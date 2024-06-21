import { Model, Types } from 'mongoose';

export interface IBooking {
  _id?: Types.ObjectId;
  room: Types.ObjectId;
  slots: Types.ObjectId[];
  user: Types.ObjectId;
  date: Date;
  totalAmount?: number;
  isConfirmed?: 'confirmed' | 'unconfirmed' | 'canceled';
  isDeleted?: boolean;
}
export interface BookingModel extends Model<IBooking> {
  isBookingExists(id: string): Promise<IBooking | null>;
  isUserBookingExists(userId: string, date: string, slots: string[] ): Promise<IBooking[] | []>;
}
