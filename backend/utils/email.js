const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendVerificationEmail = async (email, token) => {
  try {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - Smart Campus',
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link expires in 24 hours.</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

const sendPasswordResetOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - Smart Campus',
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP for password reset is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetOTP };
