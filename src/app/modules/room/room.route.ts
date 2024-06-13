import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { roomValidationSchema, roomValidations } from './room.validation';
import { RoomControllers } from './room.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post('/',auth(USER_ROLE.admin),validateRequest(roomValidationSchema),RoomControllers.createRoom);

router.get('/:id',auth(USER_ROLE.admin,USER_ROLE.user),RoomControllers.getSingleRoom);
router.get('/',auth(),RoomControllers.getAllRooms);
router.put('/:id', auth(USER_ROLE.admin), RoomControllers.updateRoom);
router.delete('/:id', auth(USER_ROLE.admin), RoomControllers.deleteRoom);

export const RoomRoutes = router;
