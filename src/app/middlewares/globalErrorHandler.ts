import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
    const statusCode = err.statusCode||200;
    const message = err.message||'Something went wrong!';

    return res.status(statusCode).json({
        sucess:false,
        message,
        error:err,
    });
};


export default globalErrorHandler;