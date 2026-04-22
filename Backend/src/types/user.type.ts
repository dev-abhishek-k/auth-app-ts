export interface IUser{
name: string;
email: string;
password: string;
role:'user'|'admin';
isVerfied: boolean;
verificationdToken: string;
refreshToken: string;
resetPasswordToken?: string | undefined;
resetPasswordExpire?: Date | undefined;
}