import crypto from "node:crypto";
import jwt from "jsonwebtoken";
 const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN as string;
 const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN as string;
 export interface JwtPayload {
     id: string;
     role: string;
   
 }
 export interface RefreshTokenPayload {
     id: string;
     
 }
 const  generateAccessToken = (Payload:JwtPayload) => {
     return jwt.sign({ Payload }, JWT_SECRET_ACCESS_TOKEN, { expiresIn: "15m" });
 };
 const verifyAccessToken = (token: string): JwtPayload => {
     return jwt.verify(token, JWT_SECRET_ACCESS_TOKEN)as JwtPayload;
 }
 const  generateRefreshToken = (Payload:RefreshTokenPayload) => {
     return jwt.sign({ Payload }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: "7d" });
 };
 
 const verifyRefreshToken = (token: string): RefreshTokenPayload => {
     return jwt.verify(token, JWT_SECRET_REFRESH_TOKEN)as RefreshTokenPayload;
 }
 const generateResetToken = () => {
     const rawToken= crypto.randomBytes(32).toString("hex");
     const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
     return {rawToken, hashedToken};
 }
 export { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken,generateResetToken };