import type { IApiResponse } from "../types/api-response.type.ts";
import type { Response } from "express"; 
import { HTTP_STATUS } from "../constants/http_status";
export class ApiResponse<T> implements IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | undefined;
  meta?: any;

  constructor(
    message: string,
    data?: T,
    meta?: any
  ) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }
  static ok<T>(
    res:Response,
    message: string,
    data?: T,
    meta?: any  
){
    return res.status(HTTP_STATUS.OK).json(new ApiResponse<T>(message, data, meta));
}
 static created<T>(
    res:Response,
    message: string,
    data?: T,
    meta?: any  
){
    return res.status(HTTP_STATUS.CREATED).json(new ApiResponse<T>(message, data));
}
  static noConten<T>(
    res:Response,
    message: string,
    data?: T,
    meta?: any  
){
    return res.status(HTTP_STATUS.NO_CONTENT).json(new ApiResponse<T>(message));   
}
  
}

