// import { z } from 'zod';

// const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// export const slotValidationSchema = z.object({
//   body: z
//     .object({
//       room: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID format'),
//       date: z
//         .string()
//         .refine(
//           (val) => dateRegex.test(val) && !isNaN(new Date(val).getTime()),
//           {
//             message: 'Invalid date format, please use YYYY-MM-DD',
//           },
//         ),
//       startTime: z.string().refine(
//         (val) => {
//           return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
//         },
//         {
//           message: 'Invalid start time format',
//         },
//       ),
//       endTime: z.string().refine(
//         (val) => {
//           return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
//         },
//         {
//           message: 'Invalid end time format',
//         },
//       ),
//     })
//     .refine(
//       (data) => {
//         console.log(data, data.startTime.split(':'), 0);
//         const [startHour, startMinute] = data.startTime.split(':').map(Number);
//         const [endHour, endMinute] = data.endTime.split(':').map(Number);
//         return (
//           startHour < endHour ||
//           (startHour === endHour && startMinute < endMinute)
//         );
//       },
//       {
//         message: 'Start time must be before end time',
//         path: ['startTime'],
//       },
//     ),
// });


//   export const updateSlotValidationSchema = z.object({
//     body: z
//       .object({
//         room: z
//           .string()
//           .regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID format')
//           .optional(),
//         date: z
//           .string()
//           .refine(
//             (val) => dateRegex.test(val) && !isNaN(new Date(val).getTime()),
//             {
//               message: 'Invalid date format, please use YYYY-MM-DD',
//             },
//           )
//           .optional(),
//         startTime: z
//           .string()
//           .refine(
//             (val) => {
//               return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
//             },
//             {
//               message: 'Invalid start time format',
//             },
//           )
//           .optional(),
//         endTime: z
//           .string()
//           .refine(
//             (val) => {
//               return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val);
//             },
//             {
//               message: 'Invalid end time format',
//             },
//           )
//           .optional(),
//       })
//       .refine(
//         (data) => {
//           // @ts-expect-error: startTime might be undefined

//           const [startHour, startMinute] = data.startTime
//             .split(':')
//             .map(Number);
//           // @ts-expect-error: end might be undefined

//           const [endHour, endMinute] = data.endTime.split(':').map(Number);
//           return (
//             startHour < endHour ||
//             (startHour === endHour && startMinute < endMinute)
//           );
//         },
//         {
//           message: 'Start time must be before end time',
//           path: ['startTime'],
//         },
//       ),
//   });
// export const slotValidations = {
//   slotValidationSchema,updateSlotValidationSchema
// };

import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const slotValidationSchema = z
  .object({
    room: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID format'),
    date: z
      .string()
      .refine((val) => dateRegex.test(val) && !isNaN(new Date(val).getTime()), {
        message: 'Invalid date format, please use YYYY-MM-DD',
      }),
    startTime: z
      .string()
      .refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: 'Invalid start time format',
      }),
    endTime: z
      .string()
      .refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: 'Invalid end time format',
      }),
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data.startTime.split(':').map(Number);
      const [endHour, endMinute] = data.endTime.split(':').map(Number);
      return (
        startHour < endHour ||
        (startHour === endHour && startMinute < endMinute)
      );
    },
    {
      message: 'Start time must be before end time',
      path: ['startTime'],
    },
  );

export const updateSlotValidationSchema = z
  .object({
    room: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID format')
      .optional(),
    date: z
      .string()
      .refine((val) => dateRegex.test(val) && !isNaN(new Date(val).getTime()), {
        message: 'Invalid date format, please use YYYY-MM-DD',
      })
      .optional(),
    startTime: z
      .string()
      .refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: 'Invalid start time format',
      })
      .optional(),
    endTime: z
      .string()
      .refine((val) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
        message: 'Invalid end time format',
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const [startHour, startMinute] = data.startTime.split(':').map(Number);
        const [endHour, endMinute] = data.endTime.split(':').map(Number);
        return (
          startHour < endHour ||
          (startHour === endHour && startMinute < endMinute)
        );
      }
      return true;
    },
    {
      message: 'Start time must be before end time',
      path: ['startTime'],
    },
  );

export const slotValidations = {
  slotValidationSchema,
  updateSlotValidationSchema,
};

