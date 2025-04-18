require("dotenv").config();
const nodemailer = require("nodemailer");

let storedOTP = null; // Store OTP temporarily

exports.sendOTP = async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  // Generate a 6-digit OTP
  storedOTP = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
  console.log("Generated OTP:", storedOTP); // Log OTP for testing

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email
      pass: process.env.EMAIL_PASS, // Use Google App Password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Your OTP Code: ${storedOTP}`,
    text: `Your OTP is: ${storedOTP}. This code will expire in 2 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// Validate OTP
exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  if (parseInt(otp) === storedOTP) {
    storedOTP = null; // Clear stored OTP after verification
    return res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP!" });
  }
};
