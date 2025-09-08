import Notification from "../models/notification.model.js";

// Create a new notification
const createNotification = async (notificationData) => {
    const notification = new Notification(notificationData);
    return await notification.save();
};

// Get all notifications for a user
const getNotificationsByUser = async (userId) => {
    return await Notification.find({ receiver: userId }).sort({ createdAt: -1 });
};

export default {
    createNotification,
    getNotificationsByUser,
};
