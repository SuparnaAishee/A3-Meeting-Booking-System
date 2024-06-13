import { z } from "zod";

export const roomValidationSchema = z.object(
  {
    name: z
      .string()
      .min(3, { message: 'Room name must be at least 3 characters long' })
      .max(100, { message: 'Room name must be at most 100 characters long' })
      .trim(),
    roomNo: z
      .number()
      .int()
      .positive({ message: 'Room number must be a positive integer' }),
    floorNo: z
      .number()
      .int()
      .nonnegative({ message: 'Floor number must be a non-negative integer' }),
    capacity: z
      .number()
      .int()
      .positive({ message: 'Capacity must be a positive integer' }),
    pricePerSlot: z
      .number()
      .nonnegative({ message: 'Price per slot must be a non-negative number' }),
    amenities: z
      .array(z.string())
      .nonempty({ message: 'There must be at least one amenity' }),
    isDeleted: z.boolean().default(false),
  },
 );


export const updateRoomValidationSchema = z.object(
  {
    name: z
      .string()
      .min(3, { message: 'Room name must be at least 3 characters long' })
      .max(100, { message: 'Room name must be at most 100 characters long' })
      .trim().optional(),
    roomNo: z
      .number()
      .int()
      .positive({ message: 'Room number must be a positive integer' }).optional(),
    floorNo: z
      .number()
      .int()
      .nonnegative({ message: 'Floor number must be a non-negative integer' }).optional(),
    capacity: z
      .number()
      .int()
      .positive({ message: 'Capacity must be a positive integer' }).optional(),
    pricePerSlot: z
      .number()
      .nonnegative({ message: 'Price per slot must be a non-negative number' }).optional(),
    amenities: z
      .array(z.string())
      .nonempty({ message: 'There must be at least one amenity' }).optional(),
    isDeleted: z.boolean().default(false).optional(),
  },
 );


export const   roomValidations={
roomValidationSchema,updateRoomValidationSchema
}