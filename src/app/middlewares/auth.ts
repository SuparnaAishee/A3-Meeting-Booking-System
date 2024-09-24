// import { NextFunction, Request, Response } from 'express';
// import catchAsync from '../utils/catchAsync';
// import AppError from '../errors/AppError';
// import httpStatus from 'http-status';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import { TUserRole } from '../modules/user/user.interface';

// const auth = (...requiredRoles: TUserRole[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const authHead = req.headers.authorization;
//     //checking if the token is sent
//     if (!authHead) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'User is not Authorized!');
//     }
//     // Splitting the Authorization header to get the Bearer token
//     const [bearer, token] = authHead.split(' ');

//     // Checking if the Authorization header has Bearer and token parts
//     if (!(bearer === 'Bearer' && token)) {
//       throw new AppError(
//         httpStatus.UNAUTHORIZED,
//         'Invalid authorization header format',
//       );
//     }

//     //checking token is valid or not

//     jwt.verify(
//       token,
//       config.jwt_access_secret as string,
//       function (err, decoded) {
//         if (err) {
//           throw new AppError(httpStatus.UNAUTHORIZED, 'Not Authorized!');
//         }

//         //check user role
//         const role = (decoded as JwtPayload).role;
//         if (requiredRoles && !requiredRoles.includes(role)) {
//           throw new AppError(
//             httpStatus.UNAUTHORIZED,
//             'You have no access to this route',
//           );
//         }
//         //decoded undefined

//         req.user = decoded as JwtPayload;

//         next();
//       },
//     );
//   });
// };

// export default auth;
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

    // Check if the authorization header is present
    if (!authHead) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, 'User is not authorized!'),
      );
    }

    // Split the Authorization header to get the Bearer token
    const [bearer, token] = authHead.split(' ');

    // Check if the header is formatted correctly
    if (!(bearer === 'Bearer' && token)) {
      return next(
        new AppError(
          httpStatus.UNAUTHORIZED,
          'Invalid authorization header format',
        ),
      );
    }

    // Verify the token
    jwt.verify(token, config.jwt_access_secret as string, (err, decoded) => {
      if (err) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            'Token is not valid or has expired',
          ),
        );
      }

      // Check if the role exists in the decoded token
      const role = (decoded as JwtPayload)?.role;
      if (!role) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload'),
        );
      }

      // Check if the user's role matches the required roles
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        return next(
          new AppError(
            httpStatus.FORBIDDEN,
            'You have no access to this route',
          ),
        );
      }

      // Attach the decoded user data to the request object
      req.user = decoded as JwtPayload;

      next();
    });
  });
};

export default auth;
