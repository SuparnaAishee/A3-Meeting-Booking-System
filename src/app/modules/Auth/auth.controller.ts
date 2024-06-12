import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { User } from "../user/user.model";
import { AuthServices } from "./auth.service";
import { AuthValidation } from "./auth.validation";




const signupUser = catchAsync(async (req, res, next) => {
  const result = await AuthServices.signupUser(req.body)
  sendResponse(res, {
  success: true,
  statusCode: 200,
  message: 'User is Registered Sucessfully',
  
  data: result,
});
 
});


const loginUser = catchAsync(async(req,res)=>
{
    const{ token,user}= await AuthServices.loginUser(req.body);

sendResponse(res, {
  success: true,
  statusCode: 200,
  message: 'User is Logged In Sucessfully',
  token: token,
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



export const AuthControllers={
    loginUser,signupUser
}