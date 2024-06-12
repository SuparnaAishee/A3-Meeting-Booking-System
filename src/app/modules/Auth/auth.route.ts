import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';

const router=express.Router();

router.post (
    '/login',validateRequest(AuthValidation.loginValidationSchema),AuthControllers.loginUser
);

router.post (
    '/signup',validateRequest(AuthValidation.signupValidationSchema),AuthControllers.signupUser
);

export const AuthRoutes = router;