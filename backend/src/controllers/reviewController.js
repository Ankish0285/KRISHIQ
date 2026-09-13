import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { successResponse } from '../utils/apiResponse.js';

export const listPublicReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ rating: { $gte: 1 } }).sort({ createdAt: -1 }).limit(12).populate('buyer', 'name profileImage role').populate('product', 'name').lean();
    return res.json(successResponse(reviews, 'Public reviews fetched.'));
  } catch (error) { next(error); }
};

export const createReview = async (req, res, next) => {
  try {
    if (req.user.role !== 'buyer') return res.status(403).json({ success: false, message: 'Only buyers can submit reviews.' });
    const { order: orderId, product: productId, rating, comment = '' } = req.body;
    const score = Number(rating);
    if (!orderId || !productId || !Number.isInteger(score) || score < 1 || score > 5 || String(comment).trim().length < 3) return res.status(400).json({ success: false, message: 'Order, product, rating and a short review are required.' });
    const order = await Order.findOne({ _id: orderId, buyer: req.user._id, orderStatus: 'delivered' }).select('items');
    if (!order || !order.items.some((item) => item.product.toString() === String(productId))) return res.status(400).json({ success: false, message: 'Reviews are available after delivery for products in your order.' });
    const review = await Review.create({ buyer: req.user._id, product: productId, order: orderId, rating: score, comment: String(comment).trim().slice(0, 600) });
    const populated = await Review.findById(review._id).populate('buyer', 'name profileImage role').populate('product', 'name').lean();
    return res.status(201).json(successResponse(populated, 'Review submitted successfully.'));
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'You have already reviewed this product for this order.' });
    next(error);
  }
};