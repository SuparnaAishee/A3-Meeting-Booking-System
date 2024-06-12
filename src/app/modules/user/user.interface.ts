import { Model } from "mongoose";


export interface TUser{
    _id:string;
    name:string,
    email:string,
    password:string,
    phone:number,
    address:string,
    role:'admin'|'user'
};

export interface UserModel extends Model<TUser>{
    // myStaticMethod():number;
    isUserExistsByEmail(email:string):Promise<TUser>;
    isPasswordMatched(plainTextPassword:string,hashedPassword:string):Promise<boolean>;
}
