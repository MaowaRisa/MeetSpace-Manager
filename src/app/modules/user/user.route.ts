import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createUserValidationSchema } from "./user.validation";
import { UserControllers } from "./user.controller";

const router = express.Router();

router.post('/signup', validateRequest(createUserValidationSchema), UserControllers.createUser );

export const userRoutes = router;