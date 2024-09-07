import { Response } from 'express';

// type TResponse<T> = {
//   statusCode: number;
//   success: boolean;
//   message?: string;
//   data: T;
//   token?: string;
// };
// Update TResponse to include an optional meta field
type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  token?:string;
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
    token: data.token,
    data: data.data,
  });
};

export default sendResponse;
