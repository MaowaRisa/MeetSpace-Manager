import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constants';
import { slotValidation } from './slot.validation';
import { SlotControllers } from './slot.controller';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(slotValidation.createSlotValidationSchema),
  SlotControllers.createSlot,
);
export const slotRoutes = router;
