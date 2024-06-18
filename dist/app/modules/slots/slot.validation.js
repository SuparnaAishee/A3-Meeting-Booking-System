"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotValidations = exports.slotValidationSchema = void 0;
const zod_1 = require("zod");
exports.slotValidationSchema = zod_1.z
    .object({
    room: zod_1.z.string().nonempty({ message: 'Room ID must be provided' }),
    date: zod_1.z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
    }),
    startTime: zod_1.z
        .string()
        .regex(/^\d{2}:\d{2}$/, {
        message: 'Invalid start time format, should be HH:MM',
    }),
    endTime: zod_1.z
        .string()
        .regex(/^\d{2}:\d{2}$/, {
        message: 'Invalid end time format, should be HH:MM',
    }),
    isBooked: zod_1.z.boolean().optional(),
})
    .refine((data) => {
    const start = new Date(`1999-01-01T${data.startTime}:00`);
    const end = new Date(`1999-01-01T${data.endTime}:00`);
    return start < end;
}, {
    message: 'Start time must be before end time',
    path: ['endTime'],
});
exports.slotValidations = {
    slotValidationSchema: exports.slotValidationSchema,
};
