import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true lang kung port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmailToProfessor(to: string, message: string) {
  await transporter.sendMail({
    from: `"Smart Maintenance" <${process.env.SMTP_USER}>`,
    to,
    subject: 'New Maintenance Request',
    text: message
  });
 
}

export async function sendOTP(email: string, code: string) {
  await transporter.sendMail({
    from: `"Smart Maintenance" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Your Login Verification Code',
    html: `
      <h2>Login Verification</h2>
      <p>Your OTP code is:</p>
      <h1>${code}</h1>
      <p>This code will expire in 5 minutes.</p>
    `
  });
}