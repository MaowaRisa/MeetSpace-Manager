import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { roomRoutes } from '../modules/room/room.route';
import { slotRoutes } from '../modules/slot/slot.route';
import {
  bookingRoutes,
  userBookingRoutes,
} from '../modules/booking/booking.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/rooms',
    route: roomRoutes,
  },
  {
    path: '/slots',
    route: slotRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
  {
    path: '/my-booking',
    route: userBookingRoutes,
  },
];
moduleRoutes.map((route) => router.use(route.path, route.route));
export default router;
