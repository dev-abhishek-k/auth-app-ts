import { RegisterInput } from './../dto/auth.dto';
import crypto from 'crypto'
import { User } from '../models/auth.models'
import { ApiError } from '../utils/api-error'
import { ApiResponse } from '../utils/api-response'
import { SendVerificationEmail } from '../config/email';
import { generateAccessToken,generateResetToken, generateRefreshToken, verifyAccessToken } from '../utils/jwt'
const hashToken= (token:string)=>{
    const hash= crypto.createHash("sha256").update(token).digest("hex");
    return hash;
}

export const registerUser=async({name,email,password,role}:RegisterInput)=>{
 const extisingUser= await User.findOne({email});
 if(extisingUser){
    throw ApiError.conflict("User already exists");
}
const {rawToken,hashedToken}= generateResetToken();
 const user= await User.create({
    name,
    email,
    password,
    role,
    verificationdToken:hashedToken,
});
 try {
    await SendVerificationEmail(email,rawToken);
 } catch (error) {
    if(error instanceof Error){
        console.log("Faliled to send email",error.message);
    }
 }
}