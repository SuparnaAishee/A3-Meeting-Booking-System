// import express from 'express';
// import validateRequest from '../../middlewares/validateRequest';
// import { AuthValidation } from './auth.validation';
// import { AuthControllers } from './auth.controller';

// const router = express.Router();

// router.post(
//   '/login',
//   validateRequest(AuthValidation.loginValidationSchema),
//   AuthControllers.loginUser,
// );

// router.post(
//   '/signup',
//   validateRequest(AuthValidation.signupValidationSchema),
//   AuthControllers.signupUser,
// );

// export const AuthRoutes = router;
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

// Login route
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

// Signup route
router.post(
  '/signup',
  validateRequest(AuthValidation.signupValidationSchema),
  AuthControllers.signupUser,
);

// Refresh token route
router.post(
  '/refresh',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
