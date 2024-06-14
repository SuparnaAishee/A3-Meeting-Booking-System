import * as z from 'zod';

export const bookingValidationSchema = z.object({
  room: z.string(),
  slots: z
    .array(
      z.string(),
    )
    .min(1, 'At least one slot ID must be provided'),
  user: z.string(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .min(1),
  totalAmount: z.number().positive('Total amount must be a positive number').optional(),
  isConfirmed: z.enum(['confirmed', 'unconfirmed', 'canceled']).optional(),
  isDeleted: z.boolean().optional(),
});

export const bookingValidations={
    bookingValidationSchema
}
