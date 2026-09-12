import Notification from '../models/Notification.js';

export const createNotification = async ({ recipient, title, message, type, relatedOrder = null }) => {
  try {
    return await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedOrder,
    });
  } catch (error) {
    console.error('Notification creation failed:', error.message);
    return null;
  }
};

export const markNotificationAsRead = async (notificationId, recipientId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: recipientId },
    { isRead: true },
    { new: true }
  );
};

export default { createNotification, markNotificationAsRead };