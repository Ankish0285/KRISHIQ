import FPO from '../models/FPO.js';
import Farmer from '../models/Farmer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { successResponse } from '../utils/apiResponse.js';

export const getFpoProfile = async (req, res, next) => {
  try {
    const fpo = await FPO.findOne({ user: req.user._id }).populate('user', '-password');
    return res.status(200).json(successResponse(fpo, 'FPO profile fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const upsertFpoProfile = async (req, res, next) => {
  try {
    const fpo = await FPO.findOneAndUpdate(
      { user: req.user._id },
      {
        organizationName: req.body.organizationName,
        registrationNumber: req.body.registrationNumber,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        location: req.body.location,
        description: req.body.description,
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

    return res.status(200).json(successResponse(fpo, 'FPO profile updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getMembers = async (req, res, next) => {
  try {
    const farmers = await Farmer.find({ fpo: req.user._id }).populate('user', '-password');
    return res.status(200).json(successResponse(farmers, 'FPO members fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const products = await Product.find({ fpo: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(successResponse(products, 'FPO inventory fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate({ path: 'items.product', select: 'name farmer fpo' });
    const filtered = orders.filter((order) =>
      order.items.some((item) => item.product && item.product.fpo && item.product.fpo.toString() === req.user._id.toString())
    );

    return res.status(200).json(successResponse(filtered, 'FPO orders fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  getFpoProfile,
  upsertFpoProfile,
  getMembers,
  getInventory,
  getOrders,
};