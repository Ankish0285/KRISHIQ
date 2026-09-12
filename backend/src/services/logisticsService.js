import Delivery from '../models/Delivery.js';
import calculateDistance from '../utils/calculateDistance.js';

export const createDeliveryRecord = async ({ order, pickupLocation, deliveryLocation, estimatedDelivery }) => {
  return Delivery.create({
    order,
    pickupLocation,
    deliveryLocation,
    estimatedDelivery,
    status: 'assigned',
  });
};

export const getDeliveryDistanceKm = (pickupLocation, deliveryLocation) => {
  if (!pickupLocation || !deliveryLocation) return 0;

  const [pickupLat, pickupLon] = pickupLocation.split(',').map(Number);
  const [deliveryLat, deliveryLon] = deliveryLocation.split(',').map(Number);

  if ([pickupLat, pickupLon, deliveryLat, deliveryLon].some((value) => Number.isNaN(value))) {
    return 0;
  }

  return calculateDistance(pickupLat, pickupLon, deliveryLat, deliveryLon);
};

export default { createDeliveryRecord, getDeliveryDistanceKm };