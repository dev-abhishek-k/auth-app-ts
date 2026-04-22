import { ApiError } from "../utils/api-error";
import { verifyAccessToken } from "../utils/jwt";
import type {Response, Request, NextFunction} from 'express';
import {User} from "../models/auth.models";

export const authenticate=async(req:Request,res:Response,next:NextFunction)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.replace("Bearer ","");
    }
    if(!token){
        throw ApiError.unauthorized("Access token missing");
    }
    try{
        const decoded= verifyAccessToken(token);
        const user=await User.findById(decoded.id);
        if(!user){
            throw ApiError.unauthorized("User no longer exists");
        }
        req.user={id:user._id.toString(),
            name:user.name,
            email:user.email,
            role:user.role
        }
        next();
    }catch(error){
        throw ApiError.unauthorized("Invalid access token");
    }

}
// high order function to authorize based on user role
export const authorize=(...roles:string[])=> (req:Request,res:Response,next:NextFunction)=>{
    if(!roles.includes(req.user.role)){
        throw ApiError.forbidden("You do not have permission to perform this action");    
    }    
    next();
}
