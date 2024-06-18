"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const room_validation_1 = require("./room.validation");
const room_controller_1 = require("./room.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(room_validation_1.roomValidationSchema), room_controller_1.RoomControllers.createRoom);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), room_controller_1.RoomControllers.getSingleRoom);
router.get('/', (0, auth_1.default)(), room_controller_1.RoomControllers.getAllRooms);
router.put('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), room_controller_1.RoomControllers.updateRoom);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), room_controller_1.RoomControllers.deleteRoom);
exports.RoomRoutes = router;
