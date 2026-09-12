import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    assignedDeliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pickupLocation: {
      type: String,
      trim: true,
    },
    deliveryLocation: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'cancelled'],
      default: 'assigned',
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
      default: null,
    },
    trackingInfo: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;