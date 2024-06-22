import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { BookingValidationSchema } from './booking.validation';
import { BookingControllers } from './booking.controller';


const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(BookingValidationSchema.createBookingValidationSchema),
  BookingControllers.createBooking
);
router.get(
  '/',
  auth(USER_ROLE.admin),
  BookingControllers.getAllBookings
);
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(BookingValidationSchema.updateBookingValidationSchema),
  BookingControllers.updateBooking
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  BookingControllers.deleteBooking
);
const userBookingRoutes = express.Router();
userBookingRoutes.get(
  '/',
  auth(USER_ROLE.user),
  BookingControllers.getBookingsByUser
);

export {router as bookingRoutes, userBookingRoutes};
