import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import config from '../config/config.js';
import { successResponse } from '../utils/apiResponse.js';

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'INR' } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ success: false, message: 'OrderId and amount are required.' });
    }

    if (!config.razorpay.keyId || !config.razorpay.keySecret) {
      return res.status(501).json({
        success: false,
        message: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment.',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: `order_${order._id}`,
    });

    const payment = await Payment.create({
      order: order._id,
      buyer: req.user._id,
      amount,
      currency,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
    });

    return res.status(200).json(
      successResponse(
        {
          paymentId: payment._id,
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: config.razorpay.keyId,
        },
        'Razorpay order created successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment verification payload.' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { razorpayPaymentId: paymentId, signature, status: 'paid' },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found.' });
    }

    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      await order.save();
    }

    return res.status(200).json(successResponse(payment, 'Payment verified successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('order').populate('buyer', 'name email');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    return res.status(200).json(successResponse(payment, 'Payment fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  createPaymentOrder,
  verifyPayment,
  getPaymentById,
};