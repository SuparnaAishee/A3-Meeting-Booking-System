import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const notFound = (
  
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(httpStatus.NOT_FOUND).json({
    sucess: false,
    message:'API Not Found!',
   error:'',
  });
};


export default notFound;