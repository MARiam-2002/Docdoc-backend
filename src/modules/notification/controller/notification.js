import { notificationModel } from "../../../../DB/models/notification.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

// Get all notifications for a user
export const getAllNotifications = asyncHandler(async (req, res) => {
  const  userId  = req.user._id;
  console.log(userId)

  const notifications = await notificationModel.find({ userId }).sort({
    createdAt: -1,
  });
  return res.status(200).json({
    message: "All notifications",
    data: notifications,
    status: true,
    code: 200,
  });
});

// Mark all notifications as seen
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId  = req.user._id;

  await notificationModel.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
  return res.status(200).json({
    message: "All notifications marked as read",
    status: true,
    code: 200,
  });
});

export const countNewNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const count = await notificationModel.countDocuments({
    userId,
    isRead: false,
  });
  return res.status(200).json({
    message: "Count of new notifications",
    data: count,
    status: true,
    code: 200,
  });
});

export const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type } = req.body;
  const notification = new notificationModel({
    title,
    message,
    type,
    userId: req.user._id,
  });
  await notification.save();
  return res.status(201).json({
    message: "Notification created",
    data: notification,
    status: true,
    code: 201,
  });
});
