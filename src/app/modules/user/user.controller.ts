import { userValidationSchema } from './user.validation';
import { User } from './user.model';

import sendResponse from '../../utils/sendResponse';

import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const zodUserData = userValidationSchema.parse(userData);
  const existingUser = await User.findOne({
    name: zodUserData.name,
  });
  if (existingUser) {
    return res.status(400).json({ error: 'User already Registered' });
  } else {
    // Create the user
    const newUser = new User(zodUserData);
    const createdUser = await newUser.save();

    sendResponse(res, {
      success: true,
      statusCode: 200,

      message: 'User is Registered Sucessfully',
      data: createdUser,
    });
  }

  // if (error.name === 'ZodError') {
  //   const errorMessage = error.errors
  //     .map((err: any) => err.message)
  //     .join(', ');
  //   return res.status(400).json({ err: errorMessage });
  // }
});
const getSingleUserByEmail = catchAsync(async (req, res) => {
  const { email } = req.params;

  const result = await UserServices.getUserByEmail(email);

  if (!result) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  } else {
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User retrieved successfully',
      data: result,
    });
  }
});

export const userControllers = {
  createUser,getSingleUserByEmail
};
