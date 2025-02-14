import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";;
import crypto from 'crypto'
import { sendMail } from "../utils/sendEmail.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !password || !phone) {
    throw new Error("Please fill all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User Already Exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, phone, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      isAdmin: newUser.isAdmin,
      isVerified: newUser.isVerified,
    });
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(email);
  console.log(password);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        isVerified: existingUser.isVerified,
      });
      return;
    }
    else {
      throw new Error("Invalid Password");
    }
  }
  else {
    throw new Error("User Not Found");
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        throw new Error("Email already in use");
      }
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.isAdmin = Boolean(req.body.isAdmin);

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// Configure Nodemailer transporter

const verifyUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    if (!email) {
      throw new Error('Please provide an email');
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save the OTP and its expiration time in the user's document
    user.verificationOTP = otp;
    user.verificationOTPExpires = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();

    const subject = "🔐 Verify Your Email - Secure Your Account";
    const html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9; text-align: center;">
        <h2 style="color: #333;">🔐 Verify Your Email</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">We received a request to verify your email address. Use the OTP below:</p>
        <div style="font-size: 24px; font-weight: bold; color: #2d89ef; padding: 10px; border: 2px dashed #2d89ef; border-radius: 5px; display: inline-block; margin: 20px auto;">
          ${otp}
        </div>
        <p style="color: #555;">This OTP is valid for <strong>1 hour</strong>. If you didn't request this, ignore this email.</p>
        <p style="color: #555; margin-top: 20px;">Thank you,<br/><strong>Your Team</strong></p>
    </div>`;

    // Send email with the OTP
    await sendMail(email, subject, "", html);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    if (user.verificationOTP !== otp) {
      throw new Error('Invalid OTP');
    }

    if (user.verificationOTPExpires < Date.now()) {
      throw new Error('OTP expired');
    }

    user.isVerified = true;
    // Clear the OTP and its expiration after successful verification
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    throw new Error(error.message);
  }
});




const sendForgetEmail = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    console.log("Email: ", email);

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      throw new Error("User not found");
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    console.log("Hashed Token: ", hashedToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create the reset URL
    console.log("Reset Token: ", resetToken);
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Email content
    const subject = "Password Reset Request";
    const text = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #007bff;">Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link will expire in <strong>1 hour</strong>.</p>
      </div>
    `;

    // Send the email
    await sendMail(email, subject, text, html);
    console.log("Email sent successfully");

    // Respond to the client
    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    throw new Error(error.message);
  }
});


const ResetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    console.log("Received Token: ", token);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed Token: ", hashedToken);

    // Find the user by reset token and check expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken, // Compare hashed token
      resetPasswordExpire: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      console.log("Invalid or expired token");
      throw new Error("Invalid or expired token");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear the reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    console.log("Password reset successful");
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    throw new Error("Server error");
  }
});



export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  sendForgetEmail,
  ResetPassword,
  verifyUser,
  verifyOTP,
};
