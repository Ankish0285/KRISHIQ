import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import OtpChallenge from '../models/OtpChallenge.js';
import generateToken from '../utils/generateToken.js';
import { successResponse } from '../utils/apiResponse.js';
import config from '../config/config.js';
import { createOtp, deliverLoginOtp, hashOtp, isOtpMatch } from '../services/otpService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  permissions: user.permissions || [],
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

const findUserByIdentifier = (identifier) => User.findOne({
  $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
});

const sendFirstLoginOtp = async (user) => {
  const otp = createOtp();
  user.loginOtpHash = hashOtp(otp);
  user.loginOtpExpiresAt = new Date(Date.now() + config.otp.expiresInMinutes * 60 * 1000);
  user.loginOtpAttempts = 0;
  user.loginOtpLastSentAt = new Date();
  await user.save();
  await deliverLoginOtp(user.email, otp);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const isValidOtp = (otp) => /^\d{6}$/.test(String(otp || '').trim());

const replaceChallenge = async ({ email, purpose, signupData }) => {
  const now = new Date();
  const existing = await OtpChallenge.findOne({ email, purpose });
  if (existing && (now.getTime() - existing.lastSentAt.getTime()) / 1000 < config.otp.resendCooldownSeconds) {
    const retryAfter = Math.ceil(config.otp.resendCooldownSeconds - (now.getTime() - existing.lastSentAt.getTime()) / 1000);
    const error = new Error(`Please wait ${retryAfter} seconds before requesting another OTP.`);
    error.statusCode = 429;
    error.retryAfter = retryAfter;
    throw error;
  }

  const otp = createOtp();
  const challenge = await OtpChallenge.findOneAndUpdate(
    { email, purpose },
    {
      email,
      purpose,
      codeHash: hashOtp(otp),
      expiresAt: new Date(now.getTime() + config.otp.expiresInMinutes * 60 * 1000),
      lastSentAt: now,
      attempts: 0,
      signupData,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await deliverLoginOtp(email, otp, purpose);
  } catch (error) {
    await OtpChallenge.deleteOne({ _id: challenge._id });
    throw error;
  }
};

const consumeChallenge = async ({ email, purpose, otp }) => {
  const challenge = await OtpChallenge.findOne({ email, purpose });
  if (!challenge) throw Object.assign(new Error('Invalid or expired OTP.'), { statusCode: 401 });
  if (challenge.attempts >= config.otp.maxAttempts) throw Object.assign(new Error('Too many OTP attempts. Request a new OTP.'), { statusCode: 429 });
  if (challenge.expiresAt.getTime() < Date.now()) {
    await challenge.deleteOne();
    throw Object.assign(new Error('OTP expired. Request a new OTP.'), { statusCode: 401 });
  }

  challenge.attempts += 1;
  if (!isOtpMatch(otp, challenge.codeHash)) {
    await challenge.save();
    throw Object.assign(new Error('Invalid OTP.'), { statusCode: 401 });
  }
  await challenge.deleteOne();
  return challenge;
};

export const sendSignupOtp = async (req, res, next) => {
  try {
    const { name, email: rawEmail, phone, password, confirmPassword, role = 'buyer', location } = req.body;
    const email = normalizeEmail(rawEmail);
    if (!name?.trim() || !isValidEmail(email) || !password || password.length < 6 || password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide valid signup details and matching passwords.' });
    }
    if (phone && !/^[6-9]\d{9}$/.test(String(phone).trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid phone number.' });
    }
    if (!['buyer', 'farmer', 'fpo'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid account role.' });
    }
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    await replaceChallenge({
      email,
      purpose: 'signup',
      signupData: { name: name.trim(), phone: phone?.trim(), passwordHash, role, location },
    });
    return res.status(200).json(successResponse(null, 'A verification OTP has been sent to your email.'));
  } catch (error) {
    next(error);
  }
};

export const verifySignupOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();
    if (!isValidEmail(email) || !isValidOtp(otp)) return res.status(400).json({ success: false, message: 'A valid email and 6-digit OTP are required.' });
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    const challenge = await consumeChallenge({ email, purpose: 'signup', otp });
    const user = await User.create({ ...challenge.signupData, email, password: challenge.signupData.passwordHash });
    const token = generateToken(user);
    return res.status(201).json(successResponse({ token, user: sanitizeUser(user) }, 'Account created successfully.'));
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(200).json(successResponse(null, 'If an account exists for this email, an OTP has been sent.'));
    }

    const now = Date.now();
    const lastSentAt = user.loginOtpLastSentAt?.getTime() || 0;
    const secondsSinceLastSend = (now - lastSentAt) / 1000;
    if (secondsSinceLastSend < config.otp.resendCooldownSeconds) {
      const retryAfter = Math.ceil(config.otp.resendCooldownSeconds - secondsSinceLastSend);
      return res.status(429).json({
        success: false,
        message: `Please wait ${retryAfter} seconds before requesting another OTP.`,
        retryAfter,
      });
    }

    const otp = createOtp();
    user.loginOtpHash = hashOtp(otp);
    user.loginOtpExpiresAt = new Date(now + config.otp.expiresInMinutes * 60 * 1000);
    user.loginOtpAttempts = 0;
    user.loginOtpLastSentAt = new Date(now);
    await user.save();
    await deliverLoginOtp(user.email, otp);

    return res.status(200).json(successResponse(null, 'If an account exists for this email, an OTP has been sent.'));
  } catch (error) {
    next(error);
  }
};

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

    const user = await findUserByIdentifier(identifier);

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

    if (user.isFirstLogin) {
      await sendFirstLoginOtp(user);
      return res.status(200).json(
        successResponse(
          {
            requiresOtp: true,
            identifier: user.email,
          },
          'A login OTP has been sent to your email. Verify the OTP to continue.'
        )
      );
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

export const verifyLoginOtp = async (req, res, next) => {
  try {
    const identifier = String(req.body.email || req.body.identifier || '').trim().toLowerCase();
    const otp = String(req.body.otp || '').trim();

    if (!isValidEmail(identifier) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ success: false, message: 'A valid email and 6-digit OTP are required.' });
    }

    const user = await findUserByIdentifier(identifier);
    if (!user || !user.isActive || !user.loginOtpHash) {
      return res.status(401).json({ success: false, message: 'Invalid OTP request.' });
    }

    if (user.loginOtpAttempts >= config.otp.maxAttempts) {
      return res.status(429).json({ success: false, message: 'Too many OTP attempts. Request a new OTP.' });
    }

    if (!user.loginOtpExpiresAt || user.loginOtpExpiresAt.getTime() < Date.now()) {
      return res.status(401).json({ success: false, message: 'OTP expired. Login again to request a new OTP.' });
    }

    user.loginOtpAttempts += 1;
    if (!isOtpMatch(String(otp), user.loginOtpHash)) {
      await user.save();
      return res.status(401).json({ success: false, message: 'Invalid OTP.' });
    }

    user.isFirstLogin = false;
    user.loginOtpHash = '';
    user.loginOtpExpiresAt = null;
    user.loginOtpAttempts = 0;
    user.loginOtpLastSentAt = null;
    await user.save();

    const token = generateToken(user);
    return res.status(200).json(
      successResponse(
        {
          token,
          user: sanitizeUser(user),
        },
        'OTP verified. Login successful.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const sendPasswordResetOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    const user = await User.findOne({ email, isActive: true });
    if (user) await replaceChallenge({ email, purpose: 'password_reset' });
    return res.status(200).json(successResponse(null, 'If an account exists for this email, a reset OTP has been sent.'));
  } catch (error) {
    next(error);
  }
};

export const verifyPasswordResetOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = String(req.body.otp || '').trim();
    if (!isValidEmail(email) || !isValidOtp(otp)) return res.status(400).json({ success: false, message: 'A valid email and 6-digit OTP are required.' });
    const challenge = await OtpChallenge.findOne({ email, purpose: 'password_reset' });
    if (!challenge) return res.status(401).json({ success: false, message: 'Invalid or expired OTP.' });
    if (challenge.attempts >= config.otp.maxAttempts) return res.status(429).json({ success: false, message: 'Too many OTP attempts. Request a new OTP.' });
    if (challenge.expiresAt.getTime() < Date.now()) {
      await challenge.deleteOne();
      return res.status(401).json({ success: false, message: 'OTP expired. Request a new OTP.' });
    }
    challenge.attempts += 1;
    if (!isOtpMatch(otp, challenge.codeHash)) {
      await challenge.save();
      return res.status(401).json({ success: false, message: 'Invalid OTP.' });
    }
    challenge.codeHash = '';
    challenge.verifiedAt = new Date();
    await challenge.save();
    return res.status(200).json(successResponse(null, 'OTP verified. Set your new password.'));
  } catch (error) {
    next(error);
  }
};

export const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password, confirmPassword } = req.body;
    if (!isValidEmail(email) || !password || password.length < 6 || password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Enter matching passwords of at least 6 characters.' });
    }
    const challenge = await OtpChallenge.findOne({ email, purpose: 'password_reset' });
    if (!challenge?.verifiedAt || Date.now() - challenge.verifiedAt.getTime() > 10 * 60 * 1000) {
      return res.status(401).json({ success: false, message: 'Password reset verification expired. Request a new OTP.' });
    }
    const user = await User.findOne({ email, isActive: true });
    if (!user) return res.status(401).json({ success: false, message: 'Password reset verification expired. Request a new OTP.' });
    user.password = password;
    user.isFirstLogin = false;
    await user.save();
    await challenge.deleteOne();
    const token = generateToken(user);
    return res.status(200).json(successResponse({ token, user: sanitizeUser(user) }, 'Password updated successfully.'));
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

export default {
  registerUser,
  loginUser,
  sendOtp,
  sendSignupOtp,
  verifySignupOtp,
  verifyLoginOtp,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPasswordWithOtp,
  getCurrentUser,
  logoutUser,
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const allowed = ['name', 'phone', 'address', 'city', 'state', 'pincode', 'location'];
    allowed.forEach((key) => { if (req.body[key] !== undefined) user[key] = String(req.body[key]).trim(); });
    if (!user.name) return res.status(400).json({ success: false, message: 'Name is required.' });
    await user.save();
    return res.json(successResponse(sanitizeUser(user), 'Profile updated successfully.'));
  } catch (error) { next(error); }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please select an image.' });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.profileImage = await uploadToCloudinary(req.file.buffer, 'krishiq/profiles');
    await user.save();
    return res.json(successResponse(sanitizeUser(user), 'Profile image updated successfully.'));
  } catch (error) { next(error); }
};