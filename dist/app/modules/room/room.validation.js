"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomValidations = exports.updateRoomValidationSchema = exports.roomValidationSchema = void 0;
const zod_1 = require("zod");
exports.roomValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, { message: 'Room name must be at least 3 characters long' })
        .max(100, { message: 'Room name must be at most 100 characters long' })
        .trim(),
    roomNo: zod_1.z
        .number()
        .int()
        .positive({ message: 'Room number must be a positive integer' }),
    floorNo: zod_1.z
        .number()
        .int()
        .nonnegative({ message: 'Floor number must be a non-negative integer' }),
    capacity: zod_1.z
        .number()
        .int()
        .positive({ message: 'Capacity must be a positive integer' }),
    pricePerSlot: zod_1.z
        .number()
        .nonnegative({ message: 'Price per slot must be a non-negative number' }),
    amenities: zod_1.z
        .array(zod_1.z.string())
        .nonempty({ message: 'There must be at least one amenity' }),
    isDeleted: zod_1.z.boolean().default(false),
});
exports.updateRoomValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, { message: 'Room name must be at least 3 characters long' })
        .max(100, { message: 'Room name must be at most 100 characters long' })
        .trim()
        .optional(),
    roomNo: zod_1.z
        .number()
        .int()
        .positive({ message: 'Room number must be a positive integer' })
        .optional(),
    floorNo: zod_1.z
        .number()
        .int()
        .nonnegative({ message: 'Floor number must be a non-negative integer' })
        .optional(),
    capacity: zod_1.z
        .number()
        .int()
        .positive({ message: 'Capacity must be a positive integer' })
        .optional(),
    pricePerSlot: zod_1.z
        .number()
        .nonnegative({ message: 'Price per slot must be a non-negative number' })
        .optional(),
    amenities: zod_1.z
        .array(zod_1.z.string())
        .nonempty({ message: 'There must be at least one amenity' })
        .optional(),
    isDeleted: zod_1.z.boolean().default(false).optional(),
});
exports.roomValidations = {
    roomValidationSchema: exports.roomValidationSchema,
    updateRoomValidationSchema: exports.updateRoomValidationSchema,
};
