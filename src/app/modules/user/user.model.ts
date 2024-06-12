import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bycrypt from 'bcrypt';

const userSchema=new Schema<TUser>(
{
name:{type:String,
    required:true,
},
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    requred:true,
},
phone:{
    type:Number,
    required:true,
},
address:{
    type:String,
    required:true,
},
role:{
    type:String,
    enum:['admin','user'],
    required:true,

},

}
);

//pre-hook
userSchema.pre('save',async function(next){
    const user = this;
    user.password = await bycrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
    next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

export const User = model<TUser>('User', userSchema);