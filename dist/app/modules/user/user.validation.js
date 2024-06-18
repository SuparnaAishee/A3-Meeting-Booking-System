"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.userValidationSchema = void 0;
const zod_1 = require("zod");
exports.userValidationSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().max(20, 'Password should not exceed 20 characters'),
    phone: zod_1.z.string(),
    address: zod_1.z.string(),
    role: zod_1.z.enum(['admin', 'user']),
});
exports.UserValidations = {
    userValidationSchema: exports.userValidationSchema,
};
