import express from 'express';

import { slotControllers } from './slot.controller';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.admin), slotControllers.createSlot);
router.get('/',slotControllers.getAllSlot );

router.get(
  '/availability',
 
  slotControllers.avaiableSlot,
);// auth(USER_ROLE.admin, USER_ROLE.user),

export const SlotRouters = router;
