import mongoose,{Schema,Document} from "mongoose";
import type { IUser } from "../types/user.type.ts";
import bcrypt from "bcrypt";
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
        select:false,
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

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password=await bcrypt.hash(this.password,Number(process.env.SALT_ROUNDS) || 10);
})
userSchema.methods.comparePassword=async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password,this.password);
}
export const User = mongoose.model<IUserDocment>("User",userSchema);