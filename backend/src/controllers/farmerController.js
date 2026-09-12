import Farmer from '../models/Farmer.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import DemandData from '../models/DemandData.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { successResponse } from '../utils/apiResponse.js';

export const getFarmerProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user._id }).populate('user', '-password');
    return res.status(200).json(successResponse(farmer, 'Farmer profile fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const upsertFarmerProfile = async (req, res, next) => {
  try {
    const farmer = await Farmer.findOneAndUpdate(
      { user: req.user._id },
      {
        farmName: req.body.farmName,
        farmSize: req.body.farmSize,
        crops: req.body.crops || [],
        farmingType: req.body.farmingType,
        certifications: req.body.certifications || [],
        address: req.body.address,
        location: req.body.location,
        bankInfo: req.body.bankInfo || {},
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

    return res.status(200).json(successResponse(farmer, 'Farmer profile updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(successResponse(products, 'Farmer inventory fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate(
      { path: 'items.product', select: 'name farmer fpo' }
    );

    const filtered = orders.filter((order) =>
      order.items.some((item) => item.product && item.product.farmer && item.product.farmer.toString() === req.user._id.toString())
    );

    return res.status(200).json(successResponse(filtered, 'Farmer orders fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getEarnings = async (req, res, next) => {
  try {
    const orders = await Order.find({ orderStatus: 'delivered' }).populate({ path: 'items.product', select: 'name farmer price' });
    const filtered = orders.filter((order) =>
      order.items.some((item) => item.product && item.product.farmer && item.product.farmer.toString() === req.user._id.toString())
    );

    const earnings = filtered.reduce((total, order) => total + order.totalAmount, 0);

    return res.status(200).json(successResponse({ earnings, orders: filtered.length }, 'Earnings fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getDemandData = async (req, res, next) => {
  try {
    const demand = await DemandData.find({}).sort({ date: -1 }).limit(20);
    return res.status(200).json(successResponse(demand, 'Demand data fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(successResponse(notifications, 'Notifications fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  getFarmerProfile,
  upsertFarmerProfile,
  getInventory,
  getOrders,
  getEarnings,
  getDemandData,
  getNotifications,
};