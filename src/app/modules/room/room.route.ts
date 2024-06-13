import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { roomValidationSchema, roomValidations } from './room.validation';
import { RoomControllers } from './room.controller';
const router = express.Router();

router.post('/',validateRequest(roomValidationSchema),RoomControllers.createRoom);

router.get('/:id',RoomControllers.getSingleRoom);

export const RoomRoutes = router;
