import crypto from "node:crypto";
import jwt from "jsonwebtoken";
 const JWT_SECRET_ACEESS_TOKEN = process.env.JWT_SECRET_ACEESS_TOKEN as string;
 const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN as string;
 export interface JwtPayload {
     id: string;
     email: string;
   
 }
 const  generateAccessToken = (Payload:JwtPayload) => {
     return jwt.sign({ Payload }, JWT_SECRET_ACEESS_TOKEN, { expiresIn: "15m" });
 };
 const verifyAccessToken = (token: string): JwtPayload => {
     return jwt.verify(token, JWT_SECRET_ACEESS_TOKEN)as JwtPayload;
 }
 const  generateRefreshToken = (id: string, email: string) => {
     return jwt.sign({ id, email }, JWT_SECRET_REFRESH_TOKEN, { expiresIn: "7d" });
 };
 
 const verifyRefreshToken = (token: string): JwtPayload => {
     return jwt.verify(token, JWT_SECRET_REFRESH_TOKEN)as JwtPayload;
 }
 const generateResetToken = () => {
     const rawToken= crypto.randomBytes(32).toString("hex");
     const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
     return {rawToken, hashedToken};
 }
 export { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken,generateResetToken };