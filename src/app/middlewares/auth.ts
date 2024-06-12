import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config';




const auth = () => {
  return catchAsync(async (req:Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    //checking if the token is sent
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User is not Authorized!');
    }

    //checking token is valid or not
    // invalid token
    jwt.verify(token,config.jwt_access_secret as string, function (err, decoded) {
      if(err)
        {
            throw new AppError(httpStatus.UNAUTHORIZED,'Not Authorized!')
        }
        //decoded undefined
        
        req.user=decoded as JwtPayload;
         next();
    });

   
  });
};

export default auth;
