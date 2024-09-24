import express from 'express';

import { slotControllers } from './slot.controller';

import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { slotValidationSchema } from './slot.validation';

// import validateRequest from '../../middlewares/validateRequest';
// import { slotValidationSchema, updateSlotValidationSchema } from './slot.validation';

const router = express.Router();

router.post(
  '/',

  slotControllers.createSlot,
);//auth(USER_ROLE.admin),
router.get(
  '/availability',
 

  slotControllers.getAvailableSlots,
);// 
router.get('/',slotControllers.getAllSlot );//,auth(USER_ROLE.admin)
router.get('/:id', auth(USER_ROLE.admin), slotControllers.getSingleSlot);

router.put('/:id',slotControllers.updateSingleslot);//validateRequest(updateSlotValidationSchema),//auth(USER_ROLE.admin),

router.delete('/:id', slotControllers.deleteSingleSlot);// auth(USER_ROLE.admin),
export const SlotRouters = router;
