import NotificationService from "../services/notification.service.js";
import LOG from "../configs/log.config.js";

// Add a new notification
export const addNotification = async (req, res) => {
  try {
    let { receiver, receiverGroup, type, message } = req.body;

    if (!message || !type) {
      return res.status(400).json({
        success: false,
        message: "Message and type are required",
      });
    }

    // If sending to all users, ignore receiver
    if (receiverGroup === "All Users") {
      receiver = null;
    }

    const newNotification = await NotificationService.createNotification({
      receiver,
      receiverGroup,
      type,
      message,
    });

    LOG.info(
      { notificationId: newNotification._id },
      "Notification created successfully"
    );

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: newNotification,
    });
  } catch (error) {
    LOG.error({ err: error }, "Error creating notification");
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// View all notifications for a user (includes broadcasts)
export const viewAllSentNotifications = async (req, res) => {
  try {
    // Fetch all notifications, newest first
    const notifications = await NotificationService.getAllNotifications();

    LOG.info(
      { count: notifications.length },
      "All notifications fetched successfully"
    );

    res.status(200).json({
      success: true,
      data: notifications,
      message: "All sent notifications fetched successfully",
    });
  } catch (error) {
    LOG.error({ err: error }, "Error fetching all sent notifications");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// View a single notification
export const viewNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.getNotificationById(id);

    if (!notification) {
      LOG.warn({ id }, "Notification not found");
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    LOG.info({ id }, "Notification fetched successfully");

    res.status(200).json({
      success: true,
      data: notification,
      message: "Notification fetched successfully",
    });
  } catch (error) {
    LOG.error(
      { err: error, id: req.params.id },
      "Error fetching notification by ID"
    );
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
