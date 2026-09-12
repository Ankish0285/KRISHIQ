import Buyer from '../models/Buyer.js';
import User from '../models/User.js';
import { successResponse } from '../utils/apiResponse.js';

export const getBuyerProfile = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOne({ user: req.user._id }).populate('user', '-password');
    return res.status(200).json(successResponse(buyer, 'Buyer profile fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const upsertBuyerProfile = async (req, res, next) => {
  try {
    const buyer = await Buyer.findOneAndUpdate(
      { user: req.user._id },
      {
        preferences: req.body.preferences || [],
        preferredCategories: req.body.preferredCategories || [],
      },
      { new: true, upsert: true }
    );

    await User.findByIdAndUpdate(req.user._id, {
      address: req.body.address || req.user.address,
      city: req.body.city || req.user.city,
      state: req.body.state || req.user.state,
      pincode: req.body.pincode || req.user.pincode,
      location: req.body.location || req.user.location,
    });

    return res.status(200).json(successResponse(buyer, 'Buyer profile updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  getBuyerProfile,
  upsertBuyerProfile,
};