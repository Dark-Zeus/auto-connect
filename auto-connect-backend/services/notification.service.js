import Notification from "../models/notification.model.js";

// Create a new notification
export const createNotification = async (data) => {
  const { receiver, receiverGroup, type, message } = data;

  const notification = new Notification({
    receiver: receiver || null,
    receiverGroup: receiverGroup || null,
    type,
    message,
  });

  return await notification.save();
};

// Get all notifications for a user
const getAllNotifications = async () => {
  return await Notification.find().sort({ createdAt: -1 });
};


export default {
    createNotification,
    getAllNotifications,
};
