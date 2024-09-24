// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';

// import { AuthServices } from './auth.service';

// const signupUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.signupUser(req.body);
//   const orderedResult = {
//     _id: result._id,
//     name: result.name,
//     email: result.email,
//     phone: result.phone,
//     role: result.role,
//     address: result.address,
//   };
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'User is Registered Sucessfully',

//     data: orderedResult,
//   });
// });

// const loginUser = catchAsync(async (req, res) => {
//   const { token, user } = await AuthServices.loginUser(req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'User is Logged In Sucessfully',
//     token: token,
//     data: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       address: user.address,
//     },
//   });
// });

// export const AuthControllers = {
//   loginUser,
//   signupUser,
// };


// import { Request, Response } from 'express';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { AuthServices } from './auth.service';

// const signupUser = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.signupUser(req.body);
//   const orderedResult = {
//     _id: result._id,
//     name: result.name,
//     email: result.email,
//     phone: result.phone,
//     role: result.role,
//     address: result.address,
//   };
//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'User is Registered Successfully',
//     data: orderedResult,
//   });
// });

// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const { token, user, refreshToken } = await AuthServices.loginUser(req.body);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'User is Logged In Successfully',
//     token,
//     refreshToken, // Include refresh token in the response
//     data: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       address: user.address,
//     },
//   });
// });

// // Refresh token function
// const refreshToken = catchAsync(async (req: Request, res: Response) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return sendResponse(res, {
//       success: false,
//       statusCode: 401,
//       message: 'Refresh token is required',
//       data: undefined
//     });
//   }

//   const { newAccessToken } = await AuthServices.refreshToken(refreshToken);

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: 'Access token refreshed successfully',
//     token: newAccessToken,
//     data: undefined
//   });
// });

// export const AuthControllers = {
//   loginUser,
//   signupUser,
//   refreshToken, // Export the refreshToken function
// };


import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const signupUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.signupUser(req.body);
  const orderedResult = {
    _id: result._id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    role: result.role,
    address: result.address,
  };
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User is Registered Successfully',
    data: orderedResult,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, user, refreshToken } = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User is Logged In Successfully',
    accessToken,
    refreshToken, 
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
    },
  });
});

// Refresh token function
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return sendResponse(res, {
      success: false,
      statusCode: 401,
      message: 'Refresh token is required',
      data: undefined,
    });
  }

  const { newAccessToken } = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Access token refreshed successfully',
    accessToken: newAccessToken,
    data: undefined,
  });
});

export const AuthControllers = {
  loginUser,
  signupUser,
  refreshToken, // Export the refreshToken function
};
