import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { slotControllers } from './slot.controller';
import { slotValidationSchema, slotValidations } from './slot.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/',auth(USER_ROLE.admin),slotControllers.createSlot)

export const SlotRouters = router;