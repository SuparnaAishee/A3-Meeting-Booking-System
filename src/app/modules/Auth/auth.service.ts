import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";
import sendResponse from "../../utils/sendResponse";



const signupUser=async(payload:TUser)=>{
  //checking if user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ' User is already Registered!',
    );
  }

  // Create new user
  const newUser = await User.create(payload);

  // Return the newly created user
  return newUser;
 
};


const loginUser = async(payload:TLoginUser)=>{

  const user = await User.isUserExistsByEmail(payload.email);


   if(!user){
         throw new AppError(httpStatus.NOT_FOUND,'This user is not found!');

    }
    //cheking the password
   if(!(await User.isPasswordMatched(payload?.password,user?.password)))

throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');

};

export const AuthServices={
    loginUser,signupUser
}