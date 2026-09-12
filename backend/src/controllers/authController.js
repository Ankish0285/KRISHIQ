import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { successResponse } from '../utils/apiResponse.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profileImage: user.profileImage,
  address: user.address,
  city: user.city,
  state: user.state,
  pincode: user.pincode,
  location: user.location,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'buyer', address, city, state, pincode, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'A user already exists with this email.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      address,
      city,
      state,
      pincode,
      location,
    });

    const token = generateToken(user);

    return res.status(201).json(
      successResponse(
        {
          token,
          user: sanitizeUser(user),
        },
        'User registered successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Identifier and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account is inactive.' });
    }

    const token = generateToken(user);

    return res.status(200).json(
      successResponse(
        {
          token,
          user: sanitizeUser(user),
        },
        'Login successful.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json(successResponse(sanitizeUser(req.user), 'User fetched successfully.'));
};

export const logoutUser = async (req, res) => {
  return res.status(200).json(successResponse(null, 'Logout successful.'));
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  return res.status(200).json(
    successResponse(
      null,
      'Password reset flow is configured for a future email provider. Set up SMTP/email service to enable full password reset.'
    )
  );
};

export const resetPassword = async (req, res) => {
  return res.status(200).json(
    successResponse(null, 'Password reset endpoint is ready for email-provider integration.')
  );
};

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};