import { RequestHandler } from 'express';
import catchAsync from '../../utility/catchAsync';
import sendResponse from '../../utility/sendResponse';
import httpStatus from 'http-status';
import { BookingServices } from './booking.service';

const createBooking: RequestHandler = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await BookingServices.createBookingIntoDB(email, req.body);
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Booking created successfully',
      data: result,
    });
  }
});
const getAllBookings: RequestHandler = catchAsync(async (req, res) => {
  const result = await BookingServices.getAllBookingsFromDB();
  if (result) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'All bookings retrieved successfully',
      data: result,
    });
  }
});
export const BookingControllers = {
  createBooking,
  getAllBookings,
};
