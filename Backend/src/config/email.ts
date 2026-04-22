import nodemailer from 'nodemailer'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 2525,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SendEmail=async(to:string,subject:string,text:string)=>{
    await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to,
        subject,
        text,
      }
     );
}

const SendVerificationEmail=async(email:string,token:string)=>{
    const url=`${process.env.CLIENT_URL}/verify-email/${token}`
    await SendEmail(email,"Email Verification",
        `Please click on the link to verify your email ${url}`)
}
const SendPasswordResetEmail=async(email:string,token:string)=>{
    const url=`${process.env.CLIENT_URL}/reset-password/${token}`
    await SendEmail(email,"Password Reset",
        `Please click on the link to reset your password ${url}`)
}

export {SendVerificationEmail,SendPasswordResetEmail}