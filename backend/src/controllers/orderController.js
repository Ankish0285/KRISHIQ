import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import Delivery from '../models/Delivery.js';
import { successResponse } from '../utils/apiResponse.js';
import { createDeliveryRecord } from '../services/logisticsService.js';

const populateOrder = (query) =>
  query
    .populate({ path: 'buyer', select: 'name email phone role' })
    .populate({ path: 'items.product', select: 'name category price images location' });

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, deliveryFee = 0 } = req.body;

    if (!items || !items.length || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Order items and shipping address are required.' });
    }

    let subtotal = 0;
    const normalizedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      if (product.availableQuantity < Number(item.quantity || 1)) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
      }

      const price = Number(product.price);
      normalizedItems.push({
        product: product._id,
        quantity: Number(item.quantity),
        price,
      });
      subtotal += price * Number(item.quantity);
    }

    const totalAmount = subtotal + Number(deliveryFee);

    const order = await Order.create({
      buyer: req.user._id,
      items: normalizedItems,
      subtotal,
      deliveryFee: Number(deliveryFee),
      totalAmount,
      shippingAddress,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    for (const item of normalizedItems) {
      const product = await Product.findById(item.product);
      product.availableQuantity -= item.quantity;
      if (product.availableQuantity <= 0) product.status = 'out_of_stock';
      await product.save();
    }

    const delivery = await createDeliveryRecord({
      order: order._id,
      pickupLocation: 'Warehouse',
      deliveryLocation: shippingAddress,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    order.delivery = delivery._id;
    await order.save();

    await Notification.create({
      recipient: req.user._id,
      title: 'Order placed',
      message: `Your order ${order._id} has been placed successfully.`,
      type: 'order_created',
      relatedOrder: order._id,
    });

    const populatedOrder = await populateOrder(Order.findById(order._id));

    return res.status(201).json(successResponse(populatedOrder, 'Order created successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'buyer') {
      query.buyer = req.user._id;
    }

    if (req.user.role === 'farmer') {
      const salesOrders = await Order.find().populate({ path: 'items.product', select: 'name farmer fpo' });
      const filtered = salesOrders.filter((order) =>
        order.items.some((item) => item.product && item.product.farmer && item.product.farmer.toString() === req.user._id.toString())
      );
      return res.status(200).json(successResponse(filtered, 'Orders fetched successfully.'));
    }

    if (req.user.role === 'fpo') {
      const salesOrders = await Order.find().populate({ path: 'items.product', select: 'name farmer fpo' });
      const filtered = salesOrders.filter((order) =>
        order.items.some((item) => item.product && item.product.fpo && item.product.fpo.toString() === req.user._id.toString())
      );
      return res.status(200).json(successResponse(filtered, 'Orders fetched successfully.'));
    }

    const orders = await populateOrder(Order.find(query)).sort({ createdAt: -1 });
    return res.status(200).json(successResponse(orders, 'Orders fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await populateOrder(Order.findById(req.params.id));

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (req.user.role !== 'admin' && order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this order.' });
    }

    return res.status(200).json(successResponse(order, 'Order fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (req.user.role !== 'admin') {
      if (req.user.role !== 'farmer' && req.user.role !== 'fpo' && req.user.role !== 'logistics') {
        return res.status(403).json({ success: false, message: 'You are not authorized to update order status.' });
      }
    }

    order.orderStatus = status;
    await order.save();

    const delivery = await Delivery.findById(order.delivery);
    if (delivery) {
      delivery.status = status === 'delivered' ? 'delivered' : delivery.status;
      await delivery.save();
    }

    await Notification.create({
      recipient: order.buyer,
      title: 'Order status updated',
      message: `Your order ${order._id} is now ${status}.`,
      type: 'delivery_update',
      relatedOrder: order._id,
    });

    return res.status(200).json(successResponse(order, 'Order status updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You cannot cancel someone else\'s order.' });
    }

    if (['delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'This order cannot be cancelled.' });
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();

    return res.status(200).json(successResponse(order, 'Order cancelled successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};