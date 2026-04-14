import mongoose,{Schema,Document} from "mongoose";
import type { IUser } from "../types/user.type.ts";

export interface IUserDocment extends IUser,Document{}

const userSchema= new Schema<IUserDocment>({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        minLength:[3,"name must be at least 3 characters"],
        maxLength:[50,"name must be at most 50 characters"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
        minLength:[6,"password must be at least 6 characters"],
        maxLength:[50,"password must be at most 50 characters"]
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerfied:{
        type:Boolean,
        default:false
    },
    verificationdToken:String,
    refreshToken:String,
    resetPasswordToken:String,
    resetPasswordExpire:Date
},
{
    timestamps:true
})

export const User = mongoose.model<IUserDocment>("User",userSchema);