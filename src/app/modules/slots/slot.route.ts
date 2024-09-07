import express from 'express';

import { slotControllers } from './slot.controller';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { slotValidationSchema, updateSlotValidationSchema } from './slot.validation';

const router = express.Router();

router.post('/', auth(USER_ROLE.admin),validateRequest(slotValidationSchema),slotControllers.createSlot);
router.get('/',auth(USER_ROLE.admin),slotControllers.getAllSlot );
router.get('/:id', auth(USER_ROLE.admin), slotControllers.getSingleSlot);
router.get(
  '/availability',auth(USER_ROLE.admin, USER_ROLE.user),
 
  slotControllers.avaiableSlot,
);
router.put('/:id',auth(USER_ROLE.admin),validateRequest(updateSlotValidationSchema),slotControllers.updateSingleslot);

router.delete('/:id', auth(USER_ROLE.admin), slotControllers.deleteSingleSlot);
export const SlotRouters = router;
