import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { roomValidationSchema, updateRoomValidationSchema } from './room.validation';
import { RoomControllers } from './room.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(roomValidationSchema),
  RoomControllers.createRoom,
);

router.get(
  '/:id',

  RoomControllers.getSingleRoom,
);
router.get('/', RoomControllers.getAllRooms);
// router.put('/:id', auth(USER_ROLE.admin), RoomControllers.updateRoom);
router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(updateRoomValidationSchema), 
  RoomControllers.updateRoom,
);

router.delete('/:id', auth(USER_ROLE.admin), RoomControllers.deleteRoom);

export const RoomRoutes = router;
