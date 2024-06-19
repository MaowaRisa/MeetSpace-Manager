import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import validator from 'validator';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
      trim: true,
      maxlength: [20, 'Name con not exceed 20 characters!'],
    },
    email: {
      type: String,
      required: [true, 'Email is required!'],
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: '{VALUE} is not a valid email',
      },
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
      select: 0,
    },
    phone: {
      type: String,
      trim: true,
      required: [true, 'Phone number is required'],
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: ['user', 'admin'],
        message: "{VALUE} is not valid user. Please select: 'user' or 'admin'",
      },
      required: [true, 'User role is required'],
    },
    address: {
      type: String,
      trim: true,
      required: [true, 'Address is required'],
    },
  },
  {
    timestamps: true,
  },
);
userSchema.pre('save', async function (next) {
  const isUserExist = await User.findOne({email: this.email});

  if (isUserExist){
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Email is already exist!',
    );
  }
  next()
})
export const User = model<TUser>('User', userSchema);
