import { RegisterInput, LoginInput } from "./../dto/auth.dto";
import crypto from "crypto";
import { User } from "../models/auth.models";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";
import { SendPasswordResetEmail, SendVerificationEmail } from "../config/email";
import {
  generateAccessToken,
  generateResetToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
const hashToken = (token: string) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash;
};

const registerUser = async ({ name, email, password, role }: RegisterInput) => {
  const extisingUser = await User.findOne({ email });
  if (extisingUser) {
    throw ApiError.conflict("User already exists");
  }
  const { rawToken, hashedToken } = generateResetToken();
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationdToken: hashedToken,
  });
  try {
    await SendVerificationEmail(email, rawToken);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Faliled to send email", error.message);
    }
  }
  const userObj = user.toObject();
  const { password: _, verificationdToken, ...safeUser } = userObj;
  return safeUser;
};

const loginUser = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid password");
  }
  const AccessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });
  const RefreshToken = generateRefreshToken({ id: user._id.toString() });
  // store hashed refresh token in db so it can be invalidated on Logout
  user.refreshToken = hashToken(RefreshToken);
  await user.save({ validateBeforeSave: false });
  const userObj = user.toObject();
  const { password: _, verificationdToken, ...safeUser } = userObj;
  return { AccessToken, RefreshToken, user: safeUser };
};

const refresh = async (token: string) => {
  if (!token) {
    throw ApiError.unauthorized("Refresh token missing");
  }
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw ApiError.notFound("User no longer exists");
  }
  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("invalid refresh token-please login again");
  }
  const AccessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });

  return { AccessToken };
};
const logout = async (userId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { refreshToken: null },
    { new: true },
  );
  if (!user) {
    throw ApiError.notFound("User no longer exists");
  }
};
const verifyEmail = async (token: string) => {
  const trimed = token.trim();
  if (!trimed) {
    throw ApiError.badRequest("Verification token is missing or invalid");
  }
  const hasedInput = hashToken(trimed);
  const user = await User.findOne({ verificationdToken: hasedInput }).select(
    "+verificationdToken",
  );
  if (!user) {
    throw ApiError.badRequest("Invalid verification token");
  }
  await User.findByIdAndUpdate(user._id, {
    $set: {
      isVerfied: true,
    },
    $unset: {
      verificationdToken: 1,
    },
  });
  return user;
};
const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw ApiError.notFound("No account associated with this email");
    }
    const { rawToken, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); 
    await user.save({ validateBeforeSave: false });
     try {
        await SendPasswordResetEmail(email,rawToken);
     } catch (error) {
        
     }
};
const resetPassword = async (token: string, newPassword: string) => {
    const trimed = token.trim();
    if (!trimed) {  
        throw ApiError.badRequest("Reset token is missing or invalid");
    }   
    const hasedInput = hashToken(trimed);
    const user = await User.findOne({
        resetPasswordToken: hasedInput,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        throw ApiError.badRequest("Invalid or expired reset token");
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
};
export { registerUser, loginUser, refresh, logout, verifyEmail, forgotPassword, resetPassword };
