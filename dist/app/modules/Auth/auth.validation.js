"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const user_validation_1 = require("../user/user.validation");
const signupValidationSchema = user_validation_1.userValidationSchema.extend({
    password: zod_1.z.string({ required_error: 'Password is required for signup.' }),
});
const loginValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required.' })
        .email({ message: 'Invalid email format.' }),
    password: zod_1.z.string({ required_error: 'Password is required.' }),
});
exports.AuthValidation = {
    loginValidationSchema,
    signupValidationSchema,
};
