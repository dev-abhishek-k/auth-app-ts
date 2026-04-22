export interface IApiError {
  success: boolean;       
  message: string;         
  statusCode: number;      
  errors?: any;            
  stack?: string;          
}