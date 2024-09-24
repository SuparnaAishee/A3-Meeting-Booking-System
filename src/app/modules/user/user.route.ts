import express from 'express';
import { userControllers } from './user.controller';
import {  userValidationSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from '../Auth/auth.validation';
import { AuthControllers } from '../Auth/auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidationSchema),
  userControllers.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.get(
  '/:email',

  userControllers.getSingleUserByEmail,
);

export const UserRoutes = router;
