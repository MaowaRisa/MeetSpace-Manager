import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  createUserValidationSchema,
  loginValidationSchema,
} from './user.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(createUserValidationSchema),
  UserControllers.createUser,
);
router.post(
  '/login',
  validateRequest(loginValidationSchema),
  UserControllers.loginUser,
);

export const userRoutes = router;
