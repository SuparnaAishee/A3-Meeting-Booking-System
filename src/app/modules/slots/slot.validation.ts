import { z, ZodSchema } from 'zod';



export const slotValidationSchema= z.object({
 
  room: z.string().nonempty({ message: 'Room ID must be provided' }),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date format' }), 
  startTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid start time format, should be HH:MM' }), 
  endTime: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Invalid end time format, should be HH:MM' }),
  isBooked: z.boolean().optional(), 
}).refine(data => {
  const start = new Date(`1999-01-01T${data.startTime}:00`);
  const end = new Date(`1999-01-01T${data.endTime}:00`);
  return start < end;
}, {
  message: 'Start time must be before end time',
  path: ['endTime'], 
});
export const slotValidations={
    slotValidationSchema
}
