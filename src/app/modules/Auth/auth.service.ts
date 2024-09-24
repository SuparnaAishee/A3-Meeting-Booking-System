// import httpStatus from 'http-status';
// import AppError from '../../errors/AppError';
// import { User } from '../user/user.model';
// import { TLoginUser } from './auth.interface';

// import { TUser } from '../user/user.interface';

// import jwt from 'jsonwebtoken';
// import config from '../../config';

// const signupUser = async (payload: TUser) => {
//   //checking if user is exist
//   const user = await User.isUserExistsByEmail(payload.email);
//   if (user) {
//     throw new AppError(httpStatus.BAD_REQUEST, ' User is already Registered!');
//   }

//   // Create new user
//   const newUser = await User.create(payload);

//   // Return the newly created user
//   return newUser;
// };

// const loginUser = async (payload: TLoginUser) => {
//   const user = await User.isUserExistsByEmail(payload.email);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//   }
//   //cheking the password
//   if (!(await User.isPasswordMatched(payload?.password, user?.password)))
//     throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');

//   //create token
//   const jwtPayload = {
//     userEmail: user.email,
//     role: user.role,
//   };

//   const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//     expiresIn: '30d',
//   });

//   // Return token and user data
//   return { token, user };
// };

// export const AuthServices = {
//   loginUser,
//   signupUser,
// };
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { TUser } from '../user/user.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

// Helper function to generate a JWT
const generateToken = (payload: object, secret: string, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Helper function to verify a JWT
const verifyToken = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

const signupUser = async (payload: TUser) => {
  // Check if user already exists
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already registered!');
  }

  // Create a new user
  const newUser = await User.create(payload);

  // Return the newly created user
  return newUser;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  // Check password
  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!');
  }

  // Create JWT payload
  const jwtPayload = {
    userEmail: user.email,
    role: user.role,
  };

  // Generate tokens
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '30m',
  ); // Access token expires in 30 minutes
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    '30d',
  ); // Refresh token expires in 30 days

  // Return tokens and user data
  return { accessToken, refreshToken, user };
};

// Add a method to refresh tokens
const refreshToken = async (token: string) => {
  try {
    // Verify the refresh token
    const decoded = (await verifyToken(
      token,
      config.jwt_refresh_secret as string,
    )) as jwt.JwtPayload;

    // Generate a new access token
    const newAccessToken = generateToken(
      { userEmail: decoded.userEmail, role: decoded.role },
      config.jwt_access_secret as string,
      '30m',
    );

    return { newAccessToken };
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }
};

export const AuthServices = {
  loginUser,
  signupUser,
  refreshToken, // Export the refreshToken method
};
