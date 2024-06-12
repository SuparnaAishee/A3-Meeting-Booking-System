import express from 'express'
import { userControllers } from './user.controller';
import { UserValidations, userValidationSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post('/',validateRequest(userValidationSchema),userControllers.createUser)

export const UserRoutes = router;