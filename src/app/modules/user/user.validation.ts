import { z } from 'zod';

export const userValidationSchema = z.object({
  name: z.string(),
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .max(20, 'Password should not exceed 20 characters'), 
  phone: z
    .string(),
   
  address: z.string(),
  role: z.enum(['admin', 'user']),
});

export const UserValidation = {
  userValidationSchema,
};

