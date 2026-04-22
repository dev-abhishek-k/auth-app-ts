import { ApiResponse } from './../utils/api-response';
import {Response, Request} from 'express';
import { RegisterInput } from '../dto/auth.dto';
import *as authServices from '../services/auth.services';


const register=async(req:Request,res:Response)=>{
   const user= await authServices.registerUser(req.body as RegisterInput);
   ApiResponse.created(res,
    "Registration successful. Please verify your email.",
    user);
}

const login=async(req:Request,res:Response)=>{
    const {user,AccessToken,RefreshToken}=await authServices.loginUser(req.body);
    res.cookie("refreshToken",RefreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    });
    ApiResponse.ok(res,"Login successful",{user,AccessToken});
}
const refreshToken=async(req:Request,res:Response)=>{
    const token=req.cookies?.refreshToken;
    const {AccessToken}=await authServices.refresh(token);
    ApiResponse.ok(res,"Token refreshed",AccessToken);
}
const logout=async(req:Request,res:Response)=>{
    await authServices.logout(req.user.id);           
    res.clearCookie("refreshToken");        
    ApiResponse.ok(res,"Logout successful");
}
const verifyEmail=async(req:Request,res:Response)=>{    
    const user=await authServices.verifyEmail(req.query.token as string);
    ApiResponse.ok(res,"Email verified successfully",user);
}
const forgotPassword=async(req:Request,res:Response)=>{     
    await authServices.forgotPassword(req.body.email);
    ApiResponse.ok(res,"Password reset email sent");    
}
const resetPassword=async(req:Request,res:Response)=>{
    await authServices.resetPassword(req.body.token,req.body.newPassword);
    ApiResponse.ok(res,"Password reset successful");
}
export {
    register,
    login,
    refreshToken,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
}    
