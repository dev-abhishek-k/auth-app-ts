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

export {
    register
}   