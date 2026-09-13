import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const createOtp = () => crypto.randomInt(100000, 1000000).toString();

export const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const isOtpMatch = (otp, otpHash) => {
  const candidateHash = Buffer.from(hashOtp(otp), 'hex');
  const storedHash = Buffer.from(otpHash || '', 'hex');

  return candidateHash.length === storedHash.length && crypto.timingSafeEqual(candidateHash, storedHash);
};

export const deliverLoginOtp = async (email, otp, purpose = 'login') => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email OTP credentials are not configured.');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: purpose === 'password_reset' ? 'Your KRISHIQ Password Reset OTP' : 'Your KRISHIQ Login OTP',
    text: `KRISHIQ\n\nYour verification code is: ${otp}\n\nThis OTP is valid for 5 minutes.\nDo not share this OTP with anyone.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#17324d;line-height:1.6">
        <div style="padding:24px 0;border-bottom:1px solid #dbe7ef">
          <strong style="font-size:24px;color:#16834b">KRISH<span style="color:#168bc2">IQ</span></strong>
        </div>
        <div style="padding:28px 0">
          <h1 style="font-size:22px;margin:0 0 12px">Your login OTP</h1>
          <p>Use the one-time password below to securely continue with KRISHIQ.</p>
          <div style="display:inline-block;padding:14px 22px;background:#eef8f2;border:1px solid #b9e4c9;border-radius:8px;font-size:30px;font-weight:700;letter-spacing:8px;color:#126b3f">${otp}</div>
          <p style="margin-top:24px"><strong>This OTP is valid for 5 minutes.</strong><br />Do not share this OTP with anyone.</p>
        </div>
        <p style="font-size:12px;color:#6b7d8c">If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  });
};
