// utils/emailUtils.js
const transporter = require('../Config/emailConfig');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  async function sendOTPEmail(email, otp) {
    try {
      let info = await transporter.sendMail({
        from: '"PowerSync" <your-email@gmail.com>',
        to: email,
        subject: "Your Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
        html: `<p>Your OTP for email verification is: <strong>${otp}</strong>. This OTP will expire in 10 minutes.</p>`
      });
  
      console.log("Message sent: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  
  module.exports = { generateOTP, sendOTPEmail };

 