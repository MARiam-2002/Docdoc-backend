import { Router } from "express";
// import * as Validators from "./auth.validation.js";
// import { isValidation } from "../../middleware/validation.middleware.js";
import * as notificationController from "./controller/notification.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";

const router = Router();
// Get all notifications for a user
router.get("/", isAuthenticated, notificationController.getAllNotifications);

// Mark all notifications as seen
router.patch(
  "/mark-all-read",
  isAuthenticated,
  notificationController.markAllNotificationsAsRead
);

// Get count of new (unread) notifications
router.get(
  "/count-new",
  isAuthenticated,
  notificationController.countNewNotifications
);

// Create a notification (for testing or admin functionality)
router.post("/", isAuthenticated, notificationController.createNotification);
export default router;
