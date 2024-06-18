import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHead = req.headers.authorization;
    //checking if the token is sent
    if (!authHead) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User is not Authorized!');
    }
    // Splitting the Authorization header to get the Bearer token
    const [bearer, token] = authHead.split(' ');

    // Checking if the Authorization header has Bearer and token parts
    if (!(bearer === 'Bearer' && token)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Invalid authorization header format',
      );
    }

    //checking token is valid or not

    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'Not Authorized!');
        }

        //check user role
        const role = (decoded as JwtPayload).role;
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You have no access to this route',
          );
        }
        //decoded undefined

        req.user = decoded as JwtPayload;

        next();
      },
    );
  });
};

export default auth;
