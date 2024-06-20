import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { roomValidation } from './room.validation';
import { RoomControllers } from './room.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(roomValidation.createRoomValidationSchema),
  RoomControllers.createRoom,
);
router.get('/', RoomControllers.getAllRooms);
router.get('/:id', RoomControllers.getSingleRoom);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(roomValidation.updateRoomValidationSchema),
  RoomControllers.updateRoom,
);
router.delete('/:id',auth(USER_ROLE.admin), RoomControllers.deleteRoom)
export const roomRoutes = router;
