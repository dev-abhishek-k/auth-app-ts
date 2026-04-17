import { RegisterInput, LoginInput } from './../dto/auth.dto';
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

 const registerUser=async({name,email,password,role}:RegisterInput)=>{
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
 const userObj=user.toObject();
const {password:_,verificationdToken,...safeUser}=userObj
  return safeUser
}

const loginUser=async({email,password}:LoginInput)=>{
    const user=await User.findOne({email}).select("+password");
    if(!user){
        throw ApiError.notFound("User not found");
    }
    const isPasswordValid=await user.comparePassword(password);
    if(!isPasswordValid){
        throw ApiError.unauthorized("Invalid password");
    }
    const AccessToken=generateAccessToken({id:user._id.toString(),role:user.role });
    const RefreshToken=generateRefreshToken({id:user._id.toString()});
    // store hashed refresh token in db so it can be invalidated on Logout
    user.refreshToken=hashToken(RefreshToken);
    await user.save({validateBeforeSave:false});
    const userObj=user.toObject();
    const {password:_,verificationdToken,...safeUser}=userObj
    return {user:AccessToken,RefreshToken,safeUser}
}

const refresh=async(token:string)=>{
if(!token){
    throw ApiError.unauthorized("Refresh token missing");
}
const decoded=verifyAccessToken(token)
const user = await User.findById(decoded.id).select("+refreshToken");
if(!user){
    throw ApiError.notFound("User no longer exists");
}
if(user.refreshToken!==hashToken(token)){
    throw ApiError.unauthorized("invalid refresh token-please login again");
}
const AccessToken=generateAccessToken({id:user._id.toString(),role:user.role });

return {AccessToken}
}
export {
    registerUser,
    loginUser,
    refresh
}