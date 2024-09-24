// import { Response } from 'express';

// // type TResponse<T> = {
// //   statusCode: number;
// //   success: boolean;
// //   message?: string;
// //   data: T;
// //   token?: string;
// // };
// // Update TResponse to include an optional meta field
// type TResponse<T> = {
//   success: boolean;
//   statusCode: number;
//   message: string;
//   data: T;
//   accessToken?:string;
//   refreshToken?:string;
//   meta?: {
//     totalRooms: number;
//     currentPage: number;
//     limit: number;
//   };
// };

// const sendResponse = <T>(res: Response, data: TResponse<T>) => {
//   res.status(data?.statusCode).json({
//     success: data.success,
//     statusCode: data.statusCode,
//     message: data.message,
//     token: data.accessToken,
//     data: data.data,
//   });
// };

// export default sendResponse;
import { Response } from 'express';

// Update TResponse to include both accessToken and refreshToken
type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  accessToken?: string;
  refreshToken?: string;
  meta?: {
    totalRooms: number;
    currentPage: number;
    limit: number;
  };
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.accessToken, // Renamed for consistency
    refreshToken: data.refreshToken, // Include refreshToken in the response
    data: data.data,
    meta: data.meta, // Include meta if present
  });
};

export default sendResponse;
