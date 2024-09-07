import express from 'express';

import { slotControllers } from './slot.controller';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/', auth(USER_ROLE.admin), slotControllers.createSlot);
router.get('/',auth(USER_ROLE.admin),slotControllers.getAllSlot );

router.get(
  '/availability',auth(USER_ROLE.admin, USER_ROLE.user),
 
  slotControllers.avaiableSlot,
);
router.put('/:id',slotControllers.updateSingleslot);

router.delete('/:id',slotControllers.deleteSingleSlot)
export const SlotRouters = router;
