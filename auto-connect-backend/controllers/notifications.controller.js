import NotificationService from "../services/notification.service.js";
import LOG from "../configs/log.config.js";

// Add a new notification
export const addNotification = async (req, res) => {
  try {
    let { receiver, type, message } = req.body;

    // Handle "All Users" case by not saving receiver
    if (receiver === "All Users") {
      receiver = undefined;
    }

    const newNotification = await NotificationService.createNotification({
      receiver,
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
export const viewNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.receiver;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Receiver user ID is required",
      });
    }

    // Fetch both targeted notifications and broadcasts
    const notifications = await NotificationService.getNotificationsByUserOrBroadcast(
      userId
    );

    LOG.info(
      { count: notifications.length },
      "Notifications fetched successfully"
    );

    res.status(200).json({
      success: true,
      data: notifications,
      message: "Notifications fetched successfully",
    });
  } catch (error) {
    LOG.error({ err: error }, "Error fetching notifications");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// View a notification by ID
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
