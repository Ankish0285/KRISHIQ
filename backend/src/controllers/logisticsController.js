import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find({})
      .populate('order')
      .populate('assignedDeliveryPartner', 'name email phone');

    return res.status(200).json(successResponse(deliveries, 'Deliveries fetched successfully.'));
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status, trackingInfo } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found.' });
    }

    delivery.status = status || delivery.status;
    delivery.trackingInfo = trackingInfo || delivery.trackingInfo;

    if (status === 'delivered') {
      delivery.actualDelivery = new Date();
    }

    await delivery.save();

    const order = await Order.findById(delivery.order);
    if (order && status === 'delivered') {
      order.orderStatus = 'delivered';
      order.paymentStatus = order.paymentStatus === 'pending' ? 'paid' : order.paymentStatus;
      await order.save();
    }

    return res.status(200).json(successResponse(delivery, 'Delivery status updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const assignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found.' });
    }

    delivery.assignedDeliveryPartner = deliveryPartnerId;
    delivery.status = 'assigned';
    await delivery.save();

    return res.status(200).json(successResponse(delivery, 'Delivery partner assigned successfully.'));
  } catch (error) {
    next(error);
  }
};

export default {
  getDeliveries,
  updateDeliveryStatus,
  assignDeliveryPartner,
};